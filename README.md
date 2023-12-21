<div align="center">
<img src="./assets/logo.png" width="300">
<h1 >
  <span style="color:#5FB0EF">Lingua</span>Gen
</h1>

This project provides an API to generate a random word and translate it in French.
</div>

## Setup

Follow these steps to set up and run the project.
Prerequisites

- Node.js installed
- NPM (Node Package Manager) installed

## Installation

1. Clone the repository:

```bash
git clone https://github.com/GridexX/linguagen.git
```

2. Navigate to the project directory:
```bash
cd linguagen
```

3. Install dependencies:
```bash
npm install
```

4. Set up Google Cloud Translation API:

    a. Create a service account on the Google Cloud Console.

    b. Download the service account key file (JSON format) and save it as `translate-key.json`.

    c. Set the environment variable for Google Cloud credentials:

    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS=translate-key.json
    ```

## Configuration

Create a `.env` file in the root of the project and add the following:

```env
RANDOM_WORD_API_URL=https://random-word-api.herokuapp.com/word?lang=en
PROJECT_ID=your-project-id
```

Replace `your-project-id` with your Google Cloud project ID.

## Running the Project

Start the project:
```bash
npm start
```

Visit http://localhost:3000 in your browser.

## Usage

```
curl http://localhost:3000
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## Author

Made before Christmas 🎄 by a BMX 🚲 rider.