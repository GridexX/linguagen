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
    Set-up a project and enable the translation API.
    Create an [API Key](https://cloud.google.com/api-keys/docs/create-manage-api-keys) for the project.

## Configuration

Create a `.env` file in the root of the project and add the following:

```env
RANDOM_WORD_API_URL=https://random-word-api.herokuapp.com/word?lang=en
PROJECT_ID=your-project-id
API_KEY=your-api-key
```

Replace `your-project-id` and `your-api-key` with your Google Cloud project ID and API key.

## Running the Project

Start the project:

```bash
npm start
```

Visit [localhost:3000](http://localhost:3000) in your browser.

## Usage

```bash
curl http://localhost:3000
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Made during Christmas 2023 🎄 by a BMX 🚲 rider.
