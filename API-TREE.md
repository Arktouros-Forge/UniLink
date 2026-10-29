server/
└── api/
└── v1/
├── auth/
│ └── mock-login.post.js
│
├── me/
│ ├── index.get.js
│ └── profile.patch.js
│
├── student/
│ ├── users/
│ │ ├── index.get.js
│ │ └── [id].get.js
│ │
│ ├── skills/
│ │ └── index.get.js
│ │
│ ├── competitions/
│ │ ├── index.get.js
│ │ ├── index.post.js
│ │ └── [id].get.js
│ │
│ ├── teams/
│ │ ├── index.post.js
│ │ └── [id]/
│ │ ├── index.get.js
│ │ ├── index.patch.js
│ │ ├── index.delete.js
│ │ ├── join.post.js
│ │ ├── leave.delete.js
│ │ ├── members.get.js
│ │ └── result.patch.js
│ │
│ ├── tasks/
│ │ ├── index.get.js
│ │ ├── index.post.js
│ │ ├── [id].patch.js
│ │ └── [id].delete.js
│ │
│ ├── timetable/
│ │ ├── events/
│ │ │ ├── index.get.js
│ │ │ ├── index.post.js
│ │ │ ├── [id].patch.js
│ │ │ └── [id].delete.js
│ │ ├── import.post.js
│ │ ├── export.get.js
│ │ └── clear.delete.js
│ │
│ └── study-match/
│ ├── search.get.js
│ ├── requests/
│ │ ├── index.get.js
│ │ ├── index.post.js
│ │ ├── [id].patch.js
│ │ └── [id].delete.js
│ ├── help-signs/
│ │ ├── index.get.js
│ │ ├── index.post.js
│ │ ├── [id].patch.js
│ │ └── [id].delete.js
│ └── history.get.js
│
└── admin/
├── dashboard.get.js
│
├── users/
│ ├── index.get.js
│ ├── [id].get.js
│ ├── [id].patch.js
│ ├── [id].delete.js
│ └── [id]/
│ └── status.patch.js
│
├── skills/
│ ├── index.get.js
│ ├── index.post.js
│ ├── [id].patch.js
│ └── [id].delete.js
│
├── categories/
│ ├── index.get.js
│ ├── index.post.js
│ ├── [id].patch.js
│ └── [id].delete.js
│
├── lecturers/
│ ├── index.get.js
│ ├── index.post.js
│ ├── [id].patch.js
│ └── [id].delete.js
│
└── competitions/
├── index.get.js
├── index.post.js
└── [id].patch.js
└── [id].delete.js
