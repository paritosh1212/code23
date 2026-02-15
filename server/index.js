import cors from 'cors';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import process from 'node:process';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const rawCorsOrigins = String(process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const normalizedCorsOrigins = rawCorsOrigins.map((origin) => origin.replace(/\/+$/, ''));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_campus';

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (normalizedCorsOrigins.length === 0) return callback(null, true);

      const normalizedOrigin = String(origin).replace(/\/+$/, '');
      if (normalizedCorsOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
app.use(express.json());

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    todayStatus: { type: String, enum: ['P', 'A', ''], default: '' },
  },
  { timestamps: true },
);

const attendanceSummarySchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    presentList: [{ type: String, required: true }],
    presentCount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    subject: { type: String, required: true },
    submissions: [{ studentName: String, rollNo: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const uploadSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true },
);

const eventParticipantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    event: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true },
);

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const adminNoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  },
  { timestamps: true },
);

const feeSchema = new mongoose.Schema(
  {
    feeName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    method: { type: String, default: '-' },
    paidBy: { type: String, default: '-' },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const facultyAssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    batch: { type: String, required: true },
    due: { type: String, required: true },
    submitted: { type: Number, default: 0 },
    total: { type: Number, default: 60 },
  },
  { timestamps: true },
);

const facultyCircularSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    audience: { type: String, required: true },
    status: { type: String, default: 'Published' },
  },
  { timestamps: true },
);

const Student = mongoose.model('Student', studentSchema);
const AttendanceSummary = mongoose.model('AttendanceSummary', attendanceSummarySchema);
const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
const Upload = mongoose.model('Upload', uploadSchema);
const EventParticipant = mongoose.model('EventParticipant', eventParticipantSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
const AdminNotice = mongoose.model('AdminNotice', adminNoticeSchema);
const Fee = mongoose.model('Fee', feeSchema);
const FacultyAssignment = mongoose.model('FacultyAssignment', facultyAssignmentSchema);
const FacultyCircular = mongoose.model('FacultyCircular', facultyCircularSchema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

const branchSeedConfig = [
  { branch: 'Computer Engineering', prefix: 'CE' },
  { branch: 'Engineering', prefix: 'EN' },
  { branch: 'MBA', prefix: 'MBA' },
  { branch: 'Pharmacy', prefix: 'PH' },
];

const firstNames = [
  'Aarav',
  'Vihaan',
  'Rudra',
  'Ayaan',
  'Kabir',
  'Aditya',
  'Isha',
  'Anaya',
  'Saanvi',
  'Kiara',
  'Riya',
  'Tanvi',
  'Neha',
  'Sana',
  'Omkar',
  'Pratik',
  'Kunal',
  'Vivek',
  'Rohan',
  'Nikhil',
];

const lastNames = [
  'Patil',
  'Jadhav',
  'Kulkarni',
  'More',
  'Shinde',
  'Pawar',
  'Khan',
  'Deshmukh',
  'Thorat',
  'Joshi',
  'Shah',
  'Borse',
  'Chavan',
  'Kadam',
  'Mali',
  'Gaikwad',
  'Salunkhe',
  'Ghadge',
  'Suryavanshi',
  'Chaudhary',
];

function buildSeedStudents(perBranch = 60) {
  return branchSeedConfig.flatMap(({ branch, prefix }) =>
    Array.from({ length: perBranch }, (_, index) => {
      const serial = index + 1;
      const firstName = firstNames[(index + prefix.length) % firstNames.length];
      const lastName = lastNames[(index * 3 + prefix.length) % lastNames.length];
      return {
        name: `${firstName} ${lastName}`,
        rollNo: `${prefix}${String(serial).padStart(3, '0')}`,
        branch,
      };
    }),
  );
}

async function ensureSeedData() {
  const seedStudents = buildSeedStudents(60);
  await Student.bulkWrite(
    seedStudents.map((student) => ({
      updateOne: {
        filter: { rollNo: student.rollNo },
        update: { $setOnInsert: student },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  const eventCount = await EventParticipant.countDocuments();
  if (eventCount === 0) {
    await EventParticipant.insertMany([
      { name: 'Hema Kumari', event: 'Cultural Fest', time: '10:30 AM' },
      { name: 'Rajesh Kumar', event: 'Robo War', time: '11:15 AM' },
    ]);
  }

  const feeCount = await Fee.countDocuments();
  if (feeCount === 0) {
    await Fee.insertMany([
      { feeName: 'College Fee', amount: 50000, status: 'Pending', method: '-', paidBy: '-', paidAt: null },
      { feeName: 'Exam Fee', amount: 2000, status: 'Pending', method: '-', paidBy: '-', paidAt: null },
      { feeName: 'Bus Fee', amount: 5000, status: 'Pending', method: '-', paidBy: '-', paidAt: null },
    ]);
  }

  // Normalize legacy demo seed rows so "Paid" appears only after user payment.
  await Fee.updateMany(
    { paidBy: 'Demo Student' },
    {
      $set: {
        status: 'Pending',
        method: '-',
        paidBy: '-',
        paidAt: null,
      },
    },
  );

  await Fee.updateMany(
    {
      status: 'Paid',
      $or: [{ paidBy: '-' }, { paidBy: '' }, { paidBy: null }, { paidBy: { $exists: false } }],
    },
    {
      $set: {
        status: 'Pending',
        method: '-',
        paidBy: '-',
        paidAt: null,
      },
    },
  );

  const noticeCount = await AdminNotice.countDocuments();
  if (noticeCount === 0) {
    await AdminNotice.insertMany([
      { title: 'Exam Cell Update', message: 'Internal assessment submissions close at 5:00 PM.', priority: 'High' },
      { title: 'Transport Circular', message: 'Weekend bus timing revised for final-year students.', priority: 'Medium' },
    ]);
  }

  const facultyAssignmentCount = await FacultyAssignment.countDocuments();
  if (facultyAssignmentCount === 0) {
    await FacultyAssignment.insertMany([
      { title: 'Module 3 Lab', batch: 'SE-A', due: '2026-02-18', submitted: 38, total: 60 },
      { title: 'Case Study Review', batch: 'MBA-B', due: '2026-02-20', submitted: 22, total: 48 },
    ]);
  }

  const facultyCircularCount = await FacultyCircular.countDocuments();
  if (facultyCircularCount === 0) {
    await FacultyCircular.insertMany([
      { title: 'Mentor Meeting at 4 PM', audience: 'SE Department', status: 'Published' },
      { title: 'Internal Viva Slot Update', audience: 'All Faculty', status: 'Draft' },
    ]);
  }
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'college-campus-api' });
});

app.get('/getStudents', async (req, res) => {
  try {
    const branch = String(req.query.branch || '').trim();
    if (!branch) {
      return res.status(400).json({ error: 'branch query is required' });
    }
    const students = await Student.find({ branch }).sort({ rollNo: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/attendance-branches', async (_req, res) => {
  try {
    const branches = await Student.distinct('branch');
    branches.sort((a, b) => a.localeCompare(b));
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/attendance-overview', async (_req, res) => {
  try {
    const overview = await Student.aggregate([
      {
        $group: {
          _id: '$branch',
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ['$todayStatus', 'P'] }, 1, 0],
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$todayStatus', 'A'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          branch: '$_id',
          total: 1,
          present: 1,
          absent: 1,
        },
      },
      { $sort: { branch: 1 } },
    ]);
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/markAttendance', async (req, res) => {
  try {
    const { studentId, status } = req.body;
    if (!studentId || !['P', 'A'].includes(status)) {
      return res.status(400).json({ error: 'Invalid studentId or status' });
    }
    await Student.findByIdAndUpdate(studentId, { todayStatus: status });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submit-final', async (req, res) => {
  try {
    const { branch, presentList, presentCount } = req.body;
    if (!branch || !Array.isArray(presentList) || typeof presentCount !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const summary = new AttendanceSummary({ branch, presentList, presentCount });
    await summary.save();
    res.json({ success: true, message: 'Attendance submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { studentId, subject } = req.body;
    if (!studentId || !subject || !req.file) {
      return res.status(400).json({ error: 'studentId, subject and file are required' });
    }
    const record = new Upload({
      studentId,
      subject,
      fileName: req.file.originalname,
      filePath: req.file.filename,
      size: req.file.size,
    });
    await record.save();
    res.json({ success: true, file: record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submit-assignments', async (req, res) => {
  try {
    const { branch, subject, submittedStudents } = req.body;
    if (!branch || !subject || !Array.isArray(submittedStudents)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const record = new AssignmentSubmission({
      branch,
      subject,
      submissions: submittedStudents,
    });
    await record.save();
    res.json({ success: true, message: 'Assignments submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/event-participants', async (_req, res) => {
  try {
    const participants = await EventParticipant.find().sort({ createdAt: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/event-participants', async (req, res) => {
  try {
    const { name, event } = req.body;
    if (!name || !event) {
      return res.status(400).json({ error: 'name and event are required' });
    }
    const participant = new EventParticipant({
      name: String(name).trim(),
      event: String(event).trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    await participant.save();
    res.status(201).json({ success: true, participant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' });
    }
    const saved = new ContactMessage({ name, email, message });
    await saved.save();
    res.status(201).json({ success: true, message: 'Message received' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/notices', async (_req, res) => {
  try {
    const notices = await AdminNotice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/admin/notices', async (req, res) => {
  try {
    const { title, message, priority } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }

    const cleanedPriority = ['High', 'Medium', 'Low'].includes(priority) ? priority : 'Medium';
    const notice = new AdminNotice({
      title: String(title).trim(),
      message: String(message).trim(),
      priority: cleanedPriority,
    });

    await notice.save();
    res.status(201).json({ success: true, notice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/faculty/assignments', async (_req, res) => {
  try {
    const assignments = await FacultyAssignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/faculty/assignments', async (req, res) => {
  try {
    const { title, batch, due, submitted, total } = req.body;
    if (!title || !batch || !due) {
      return res.status(400).json({ error: 'title, batch and due are required' });
    }

    const assignment = new FacultyAssignment({
      title: String(title).trim(),
      batch: String(batch).trim(),
      due: String(due).trim(),
      submitted: Number.isFinite(submitted) ? submitted : 0,
      total: Number.isFinite(total) ? total : 60,
    });

    await assignment.save();
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/faculty/circulars', async (_req, res) => {
  try {
    const circulars = await FacultyCircular.find().sort({ createdAt: -1 });
    res.json(circulars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/faculty/circulars', async (req, res) => {
  try {
    const { title, audience, status } = req.body;
    if (!title || !audience) {
      return res.status(400).json({ error: 'title and audience are required' });
    }

    const circular = new FacultyCircular({
      title: String(title).trim(),
      audience: String(audience).trim(),
      status: String(status || 'Published').trim(),
    });

    await circular.save();
    res.status(201).json({ success: true, circular });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fees', async (_req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: 1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/fees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidBy, method } = req.body;

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ error: 'Fee item not found' });
    }

    if (status) {
      fee.status = status;
    }
    if (paidBy) {
      fee.paidBy = String(paidBy).trim();
    }
    if (method) {
      fee.method = String(method).trim();
    }
    if (fee.status === 'Paid') {
      fee.paidAt = new Date();
    }

    await fee.save();
    res.json({ success: true, fee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fees/pay-one', async (req, res) => {
  try {
    const { feeId, method, paidBy } = req.body;
    if (!feeId || !method || !paidBy) {
      return res.status(400).json({ error: 'feeId, method and paidBy are required' });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ error: 'Fee item not found' });
    }

    if (fee.status === 'Paid') {
      const fees = await Fee.find().sort({ createdAt: 1 });
      return res.json({ success: true, message: 'Fee already paid', fees });
    }

    fee.status = 'Paid';
    fee.method = String(method).trim();
    fee.paidBy = String(paidBy).trim();
    fee.paidAt = new Date();
    await fee.save();

    const fees = await Fee.find().sort({ createdAt: 1 });
    res.json({ success: true, fees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fees/pay-pending', async (req, res) => {
  try {
    const { method, paidBy } = req.body;
    if (!method || !paidBy) {
      return res.status(400).json({ error: 'payment method and paidBy are required' });
    }

    await Fee.updateMany(
      { status: 'Pending' },
      {
        $set: {
          status: 'Paid',
          method: String(method).trim(),
          paidBy: String(paidBy).trim(),
          paidAt: new Date(),
        },
      },
    );

    const fees = await Fee.find().sort({ createdAt: 1 });
    res.json({ success: true, fees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    await ensureSeedData();
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
