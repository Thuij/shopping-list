# Code challenge: Interactive Shopping list
Estimated time to completion: 2.5 hrs to 4hrs
# Introduction
This challenge combines array iteration, DOM manipulation, and event handling to create an interactive shopping list application.

# Objective: 
Develop a webpage with a shopping list. Users can add items to the list, mark items as purchased, and clear the list.

# Requirements:
Array: Maintain a JavaScript array to store shopping list items.

# DOM Manipulation instructions:
Create an HTML structure with an input field for adding items, a list container to display items, and buttons for "Add", "Mark Purchased", and "Clear List".
Use JavaScript to dynamically add new items to the list container when the user clicks the "Add" button. (The new items do not have to be persisted once the page refreshes)
Update the list item visually to indicate purchased items (e.g., strikethrough text, different background color).
Update the total cost of the selected items. 
Event Handling:
Attach event listeners to the "Add" button to capture user input and add items to the list.
Attach event listeners to the list of items to allow users to mark them as purchased.
Attach an event listener to the "Clear List" button to remove all items from the list.
Other Features:
Allow users to edit existing list items.
Implement persistence using local storage to save the list even after the page reloads.

# Example link
https://shopping-list-demo.pages.dev

```js example
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("itemForm");
    const nameInput = document.getElementById("itemName");
    const priceInput = document.getElementById("itemPrice");
    const addBtn = document.getElementById("addBtn");
    const list = document.getElementById("shoppingList");
