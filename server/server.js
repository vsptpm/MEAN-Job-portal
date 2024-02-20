const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
}));
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/jobApplications', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const applicationSchema = new mongoose.Schema({
    unqId: {
        type: String,
        default: uuidv4,
    },
    name: String,
    dob: Date,
    city: String,
    resume: String,
    additionalDocuments: [String],
    phone: String,
    description: String,
});

const Application = mongoose.model('Application', applicationSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/applications', async (req, res) => {
    const applications = await Application.find();
    res.json(applications);
});
app.get('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const application = await Application.findOne({ unqId: id });
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        console.error('Error fetching application by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/api/applications', upload.array('additionalDocuments', 5), async (req, res) => {
    const newApplication = new Application(req.body);

    newApplication.resume = req.file ? `/uploads/${req.file.filename}` : null;
    newApplication.additionalDocuments = req.files.map(file => `/uploads/${file.filename}`);

    await newApplication.save();

    res.status(201).json(newApplication);
});
app.put('/api/applications/:id', upload.array('additionalDocuments', 5), async (req, res) => {
    const { id } = req.params;

    try {
        const updatedApplication = await Application.findOneAndUpdate({ unqId: id }, req.body, { new: true });

        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
