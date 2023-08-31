const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser'); 
const cors = require('cors');
const app = express();

const PORT = 8000;

app.use(cors());
app.use(bodyParser.json()); 


let customers = [];

(async () => {
  try {
    const jsonData = await fs.readFile('data.json', 'utf-8');
    customers = JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading JSON file:', error);
  }
})();

app.get('/api/customers', (req, res) => {
  res.json(customers);
});



app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const updatedCustomer = req.body;
//   console.log("id is", id + "data is", updatedCustomer);

  customers = customers.map(customer =>
    customer.id === parseInt(id) ? { ...customer, ...updatedCustomer } : customer
  );

  saveDataToFile();
  res.status(200).json(customers);
});

app.delete('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  customers = customers.filter(customer => customer.id !== parseInt(id));

  saveDataToFile();
  res.status(200).json(customers);
});

async function saveDataToFile() {
  try {
    await fs.writeFile('data.json', JSON.stringify(customers, null, 2));
  } catch (error) {
    console.error('Error writing JSON file:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
