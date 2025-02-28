# 5S Dashboard

A web-based dashboard for managing 5S data, built using Flask, Jinja2, SQL Server and Bootstrap.

## 📌 Features
- Sidebar navigation with dynamic active links
- Dashboard pages using Jinja templating
- Bootstrap-based UI
- Data visualization with ApexCharts

## 🚀 Installation

### Prerequisites
Ensure you have the following installed:
- Python 3.x
- pip (Python package manager)
- virtualenv (optional but recommended)

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Via-DT-BW/5S-s.git 
cd 5S-s
```

### 2️⃣ Create a Virtual Environment (Optional but Recommended)
```sh
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 3️⃣ Install Dependencies
```sh
pip install -r requirements.txt
```

### 4️⃣ Run the Flask Application
```sh
flask run
```
The server should now be running at `http://127.0.0.1:5000/`.

## 📁 Project Structure
```
5s-dashboard/
│── static/               # Static assets (CSS, JS, images)
│── templates/
│   │── base.html         # Main base template
│   │── dashboard/
│   │   │── dashboard_base.html   # Base for dashboard pages
│   │   │── list_all.html         # Example dashboard page
│   │   └── components/
│   │       │── sidebar.html      # Sidebar template
│   │       └── footer.html       # Footer template
│── app.py                 # Flask app entry point
│── requirements.txt        # Python dependencies
└── README.md               # This file
```

## 📜 License
This project is licensed under the MIT License.
