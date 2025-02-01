// مصفوفة من الاقتباسات
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
  { text: "In the end, it's not the years in your life that count, it's the life in your years.", category: "Life" }
];

// دالة لاختيار الاقتباس العشوائي
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length); // اختيار فهرس عشوائي
  const quote = quotes[randomIndex]; // جلب الاقتباس العشوائي

  // تحديث المحتوى في الـ DOM
  document.getElementById('quoteDisplay').innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>Category: ${quote.category}</em></p>
  `;
}

// دالة لإضافة اقتباس جديد
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value; // جلب النص من الحقل
  const newQuoteCategory = document.getElementById('newQuoteCategory').value; // جلب الفئة من الحقل

  if (newQuoteText && newQuoteCategory) { // التأكد من أن الحقول غير فارغة
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory
    };

    quotes.push(newQuote); // إضافة الاقتباس الجديد إلى المصفوفة
    displayRandomQuote(); // عرض الاقتباس الجديد العشوائي

    // مسح الحقول بعد الإضافة
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill in both fields!"); // إذا كانت الحقول فارغة
  }
}

// إضافة مستمع الحدث للزر
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// تحميل الاقتباس العشوائي عند بدء الصفحة
window.onload = displayRandomQuote;
