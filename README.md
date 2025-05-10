
# 🎬 TranscriptoTube

**TranscriptoTube** is a Django-based web application that allows users to **paste any YouTube video URL**, watch it directly in the browser, and **instantly view the full transcript** — all within the app. Logged-in users can also **view their transcript history**, search transcripts, and download them for later use.

---

## 🚀 Features

- 🔐 **User Authentication** — Register, login, and view your personal transcript history.
- 🎥 **YouTube Player Embed** — Paste a video URL and stream it right inside the app.
- 📝 **Transcript Extraction** — Auto-fetch subtitles using `youtube-transcript-api`.
- 🔍 **Keyword Search** — Search and highlight words within the transcript.
- 💾 **Transcript Download** — Copy or download transcripts in plain text.
- 🕓 **History Tracking** — View your recently accessed videos with timestamps.
- 🌗 **Dark Mode** *(optional)* — Comfortable viewing for night owls.

---

## 📸 Demo

> _Coming Soon_: Hosted demo link / Screenshots / GIF

---

## 🛠️ Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| Backend    | Django, SQLite         |
| Frontend   | HTML5, Bootstrap/Tailwind CSS |
| Transcripts| `youtube-transcript-api` |
| Auth       | Django’s built-in auth system |

---

## ⚙️ Installation

> Prerequisites: Python 3.8+, pip, and virtualenv

```bash
# 1. Clone the repository
git clone https://github.com/Rugwiroparfait/transcriptotube.git
cd transcriptotube

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Start the development server
python manage.py runserver
````

Visit `http://127.0.0.1:8000/` in your browser.

---

## 🔐 Default User Accounts (For Demo)

| Role | Username | Password |
| ---- | -------- | -------- |
| User | demo     | demo123  |

> You can also register a new account.

---

## 🧪 Development Features

* Modular Django app with reusable views and templates
* Clean separation of logic: views, forms, models
* REST-friendly structure (easy to add DRF later!)
* YouTube URL parsing & regex validation
* Easily extendable: Add summaries, AI, export as PDF, etc.

---

## 📂 Project Structure

```
transcriptotube/
├── core/
│   ├── models.py      # Video history
│   ├── views.py       # Auth + transcript logic
│   ├── forms.py       # User registration
│   ├── templates/     # All HTML pages
├── static/            # CSS & JS
├── requirements.txt
├── manage.py
└── README.md
```

---

## 📌 Roadmap

* [x] Embed YouTube player
* [x] Fetch transcripts via API
* [x] Add search functionality
* [x] Save user history
* [ ] Dark mode support
* [ ] Deploy to Vercel / Render
* [ ] Add summarization (AI/LLM integration)

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork, open issues, or submit improvements.

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Credits

* YouTube Transcript API by [jdepoix](https://github.com/jdepoix/youtube-transcript-api)
* Made with ❤️ by [Rugwiro Parfait](https://github.com/Rugwiroparfait)

---

## ✨ Inspiration

> "Technology is best when it brings people together." — Matt Mullenweg

```
