const IncomeSchema = require("../models/incomeModel");

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    const Income = new IncomeSchema({
        title, amount, category, description, date
    });
    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        
        const newincome = await Income.save();
        res.status(201).json(newincome);
    } catch (err) {
        res.status(400).json({message: err.message})
    }
}

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
        res.json(incomes);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    IncomeSchema.findByIdAndDelete(id)
        .then((income) => {
            res.status(200).json({ message: 'Income Deleted' });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Server Error' });
        });
}


