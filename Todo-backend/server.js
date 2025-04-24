const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/todo-app')
   .then(() => {
    console.log("Connected to MongoDB")
    })
    .catch(err => {
        console.log(err)
        
    })

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
});

const todoModel = mongoose.model('Todo', todoSchema);

app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
    

})

app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
    
})

app.put('/todos/:id', async (req, res) =>{
   try {
    const {title, description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title, description},
        {new: true}
    )
    if (!updatedTodo) {
        res.status(404).json({message: "Todo not found"});
    }
    res.json(updatedTodo);
   } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
   }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

const port = 4000;
app.listen(port,() => {
    console.log("Server is running on port "+ port);
})