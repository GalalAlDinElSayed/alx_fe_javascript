let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];

function showRandomQuote() {
    if (quotes.length === 0) {
        alert("No quotes available!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === '' || newQuoteCategory === '') {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    categories.push(newQuoteCategory);

    // Remove duplicates in categories
    categories = [...new Set(categories)];

    // Update local storage
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('categories', JSON.stringify(categories));

    alert("Quote added successfully!");
    populateCategories(); // Update categories dropdown
    showRandomQuote(); // Show the added quote
}

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset filter options

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes();
    }
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filteredQuotes);
}

function displayQuotes(quotesToDisplay) {
    const quoteContainer = document.getElementById('quoteDisplay');
    if (quotesToDisplay.length > 0) {
        quoteContainer.innerHTML = quotesToDisplay.map(q => `"${q.text}" - ${q.category}`).join('<br>');
    } else {
        quoteContainer.innerHTML = 'No quotes available for this category.';
    }
}

function exportToJsonFile() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        alert('Quotes imported successfully!');
        showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
}

function syncQuotes() {
    // Simulate syncing with a server using a mock API (like JSONPlaceholder)
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotes)
    })
    .then(response => response.json())
    .then(data => {
        // Assume the server responded with the updated quotes
        quotes = data;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        alert('Quotes synced with server!');
    })
    .catch(error => {
        console.error('Error syncing quotes:', error);
    });
}

// Run the sync function every 5 minutes (300000 ms)
setInterval(syncQuotes, 300000);

// Initialize categories and quotes on page load
populateCategories();
showRandomQuote();

// Event listener for the "Show New Quote" button
document.getElementById('showRandomQuote').addEventListener('click', showRandomQuote);
