const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Import User model
const Patient = require('./models/Patient'); // Import Patient model
const Appointment = require('./models/Appointment'); // Import Appointment model

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://divyavelayuthasamy:Eo7nuu1URNLPsgXl@cluster0.lkw3orf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Here you can generate a token and send it back for authentication
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Appointments routes
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

app.post('/appointments/add', async (req, res) => {
  const { patientName, doctorName, date } = req.body;
	const newAppointment =
		new Appointment({ patientName, doctorName, date });

	newAppointment.save()
		.then(savedAppointment => res.json(savedAppointment))
		.catch(err => res.status(400).json('Error: ' + err));
});

app.post('/appointments/update/:id', async (req, res) => {
  Appointment.findById(req.params.id)
		.then(appointment => {
			appointment.patientName =
				req.body.patientName;
			appointment.doctorName =
				req.body.doctorName;
			appointment.date =
				req.body.date;

			appointment.save()
				.then(
					() =>
						res.json('Appointment updated!'))
				.catch(
					err => res.status(400)
						.json('Error: ' + err));
		})
		.catch(
			err => res.status(400)
				.json('Error: ' + err));
});

app.delete('/appointments/delete/:id', async (req, res) => {
		Appointment.findByIdAndDelete(req.params.id)
			.then(
				() => res
					.json('Appointment deleted.'))
			.catch(
				err => res
					.status(400).json('Error: ' + err));
});


// Patients routes
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

app.post('/patients/add', async (req, res) => {
  const { name, age, gender, bid } = req.body;

		const newPatient =
			new Patient({ name, age, gender, bid });

		newPatient.save()
			.then(savedPatient =>
				res.json(savedPatient))
			.catch(err => res.status(400)
				.json('Error: ' + err));
});

app.post('/patients/update/:id', async (req, res) => {
  console.log('hihhhhiuhiihihiuhiuh');

		Patient.findById(req.params.id)
			.then(patient => {
				if (!patient) {
					return res.status(404)
						.json('Patient not found');
				}

				patient.name = req.body.name;
				patient.age = req.body.age;
				patient.gender = req.body.gender;
				patient.bid = req.body.bid;

				patient.save()
					.then(() => res.json('Patient updated!'))
					.catch(err => res.status(400)
						.json('Error: ' + err));
			})
			.catch(err => res.status(400)
				.json('Error: ' + err));
});

app.delete('/patients/delete/:id', async (req, res) => {
  Patient.findByIdAndDelete(req.params.id)
			.then(patient => {
				if (!patient) {
					return res.status(404)
						.json('Patient not found');
				}
				res.json('Patient deleted!');
			})
			.catch(err => res.status(400)
				.json('Error: ' + err));
});

// Other routes
// ...


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

