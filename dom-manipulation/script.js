let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let serverQuotes = [];
let syncInProgress = false;

// Periodically check for new quotes from the server every 30 seconds
setInterval(syncQuotes, 30000);

// Function to simulate fetching quotes from a mock server using async/await
async function fetchQuotesFromServer() {
    if (syncInProgress) return; // Prevent overlapping syncs
    syncInProgress = true;

    try {
        // Simulate fetching data from a mock API (JSONPlaceholder or another mock API)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        serverQuotes = data;
        syncQuotes();
    } catch (error) {
        console.error('Error fetching data from server:', error);
    } finally {
        syncInProgress = false;
    }
}

// Function to sync the local quotes with the server quotes
function syncQuotes() {
    fetchQuotesFromServer();

    // Simple conflict resolution: if data on the server is different, update local storage
    const localQuoteTexts = quotes.map(quote => quote.text);
    const newServerQuotes = serverQuotes.filter(serverQuote => !localQuoteTexts.includes(serverQuote.body));

    if (newServerQuotes.length > 0) {
        quotes = [...quotes, ...newServerQuotes.map(quote => ({ text: quote.body, category: "Uncategorized" }))];
        saveQuotes();
        showConflictNotification("New quotes have been fetched from the server.");
        populateCategories();
        filterQuotes();
    }
}

// Function to handle conflict notifications
function showConflictNotification(message) {
    const notification = document.getElementById("conflictNotification");
    notification.innerHTML = `<p>${message}</p>`;
    setTimeout(() => notification.innerHTML = "", 5000); // Hide the notification after 5 seconds
}

// Function to show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        alert("No quotes available!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>${quote.text} <strong>(${quote.category})</strong></p>`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        alert("Quote added!");
    } else {
        alert("Please enter both quote and category.");
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to populate categories in the filter dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = Array.from(new Set(quotes.map(quote => quote.category)));

    // Clear previous categories
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add unique categories to the dropdown
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement("p");
        quoteElement.innerHTML = `${quote.text} <strong>(${quote.category})</strong>`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Store the last selected category in localStorage
document.getElementById("categoryFilter").addEventListener('change', function () {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
});

// Load data and initialize
window.onload = function () {
    populateCategories();
    showRandomQuote(); // Display a random quote when the page loads
};
