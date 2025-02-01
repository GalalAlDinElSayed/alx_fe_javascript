// Initial quotes array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Load the quotes and selected category from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load the last selected category from local storage
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  document.getElementById('categoryFilter').value = lastSelectedCategory;
  populateCategories();
  filterQuotes(); // Display quotes based on the selected category
});

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = 'No quotes available.';
    return;
  }
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quoteDisplay').innerHTML = `${randomQuote.text} - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    // Save the updated quotes array in local storage
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Update the categories in the dropdown
    populateCategories();

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    filterQuotes(); // Refresh the displayed quotes
  }
}

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
  categories.forEach(category => {
    if (![...categoryFilter.options].some(option => option.value === category)) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save the selected category to local storage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  displayQuotes(filteredQuotes);
}

// Function to display quotes in the DOM
function displayQuotes(filteredQuotes) {
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = 'No quotes available for this category.';
    return;
  }

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.textContent = `${quote.text} - ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);
  });
}
