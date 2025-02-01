let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let serverQuotes = [];
let syncInProgress = false;

// Simulate fetching quotes from the server every 30 seconds
setInterval(fetchServerQuotes, 30000);

// Function to simulate fetching data from the server
function fetchServerQuotes() {
    if (syncInProgress) return; // Prevent overlapping syncs
    syncInProgress = true;

    fetch('https://jsonplaceholder.typicode.com/posts') // Using JSONPlaceholder as the mock API
        .then(response => response.json())
        .then(data => {
            serverQuotes = data;
            resolveConflicts();
        })
        .catch(error => console.error('Error fetching server data:', error))
        .finally(() => {
            syncInProgress = false;
        });
}

// Function to resolve conflicts: If data differs, server data takes priority
function resolveConflicts() {
    const localQuoteTexts = quotes.map(quote => quote.text);
    const newServerQuotes = serverQuotes.filter(serverQuote => !localQuoteTexts.includes(serverQuote.body));

    if (newServerQuotes.length > 0) {
        quotes = [...quotes, ...newServerQuotes.map(quote => ({ text: quote.body, category: "Uncategorized" }))];
        saveQuotes();
        showConflictNotification("New quotes have been fetched from the server and added.");
        populateCategories();
        filterQuotes();
    }
}

// Show notification if new data is fetched or conflict resolution happens
function showConflictNotification(message) {
    const notification = document.getElementById("conflictNotification");
    notification.innerHTML = `<p>${message}</p>`;
    setTimeout(() => notification.innerHTML = "", 5000); // Hide the notification after 5 seconds
}

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

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

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

window.onload = function () {
    populateCategories();
    showRandomQuote(); // Display a random quote when the page loads
};

// Store the last selected category in localStorage
document.getElementById("categoryFilter").addEventListener('change', function () {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
});
