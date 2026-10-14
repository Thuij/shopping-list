document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("itemForm");
    const nameInput = document.getElementById("itemName");
    const priceInput = document.getElementById("itemPrice");
    const addBtn = document.getElementById("addBtn");
    const list = document.getElementById("shoppingList");

    const totalCost = document.getElementById("totalCost");
    const purchasedCost = document.getElementById("purchasedCost");
    const totalItems = document.getElementById("totalItems");
    const purchasedItems = document.getElementById("purchasedItems");

    const markAllBtn = document.getElementById("markAllBtn");
    const clearBtn = document.getElementById("clearBtn");

    const STORAGE_KEY = "shoppingListItems";

    const defaults = [
        { id: 1, name: "Milk", price: 50, purchased: false },
        { id: 2, name: "Bread", price: 100, purchased: false },
        { id: 3, name: "Eggs", price: 100, purchased: false },
        { id: 4, name: "Sugar", price: 200, purchased: false },
        { id: 5, name: "Rice", price: 100, purchased: false },
        { id: 6, name: "Cooking Oil", price: 450, purchased: false }
    ];

    let items = loadItems();
    let editingId = null;

    function loadItems() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved !== null) {
                const parsed = JSON.parse(saved);

                if (
                    Array.isArray(parsed) &&
                    parsed.every(item =>
                        item &&
                        Number.isSafeInteger(item.id) &&
                        typeof item.name === "string" &&
                        item.name.trim().length > 0 &&
                        Number.isFinite(item.price) &&
                        item.price >= 0 &&
                        typeof item.purchased === "boolean"
                    )
                ) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Unable to load saved items:", error);
        }

        return defaults.map(item => ({ ...item }));
    }

    function saveItems() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Unable to save shopping list:", error);
            alert("Unable to save changes in this browser.");
        }
    }

    function money(amount) {
        return "KES " + amount.toFixed(2);
    }

    function render() {
        list.replaceChildren();

        items.forEach(item => {
            const li = document.createElement("li");
            li.className = "shopping-item";

            if (item.purchased) {
                li.classList.add("purchased");
            }

            const info = document.createElement("div");
            info.className = "item-info";

            const name = document.createElement("div");
            name.className = "item-name";
            name.textContent = item.name;

            const price = document.createElement("div");
            price.className = "item-price";
            price.textContent = money(item.price);

            info.append(name, price);

            const actions = document.createElement("div");
            actions.className = "item-actions";

            const purchaseBtn = createButton(
                item.purchased ? "Undo Purchase" : "Purchased",
                "purchase-btn",
                () => {
                    item.purchased = !item.purchased;
                    saveItems();
                    render();
                }
            );

            const editBtn = createButton("Edit", "edit-btn", () => {
                editingId = item.id;
                nameInput.value = item.name;
                priceInput.value = item.price;
                addBtn.textContent = "Save Changes";
                nameInput.focus();
            });

            const deleteBtn = createButton("Delete", "delete-btn", () => {
                if (!confirm(`Delete "${item.name}"?`)) return;

                items = items.filter(entry => entry.id !== item.id);

                if (editingId === item.id) {
                    resetForm();
                }

                saveItems();
                render();
            });

            actions.append(purchaseBtn, editBtn, deleteBtn);
            li.append(info, actions);
            list.appendChild(li);
        });

        updateSummary();
    }

    function createButton(label, className, action) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.addEventListener("click", action);
        return button;
    }

    function updateSummary() {
        const total = items.reduce((sum, item) => sum + item.price, 0);

        const purchased = items.filter(item => item.purchased);
        const spent = purchased.reduce((sum, item) => sum + item.price, 0);

        totalCost.textContent = money(total);
        purchasedCost.textContent = money(spent);
        totalItems.textContent = items.length;
        purchasedItems.textContent = purchased.length;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const priceText = priceInput.value.trim();
        const price = Number(priceText);

        if (!name || name.length > 100) {
            alert("Enter an item name between 1 and 100 characters.");
            nameInput.focus();
            return;
        }

        if (priceText === "" || !Number.isFinite(price) || price < 0) {
            alert("Enter a valid price of zero or more.");
            priceInput.focus();
            return;
        }

        if (editingId !== null) {
            const item = items.find(entry => entry.id === editingId);

            if (item) {
                item.name = name;
                item.price = price;
            }
        } else {
            let id;

            do {
                id = Date.now() + Math.floor(Math.random() * 1000000);
            } while (items.some(item => item.id === id));

            items.push({
                id,
                name,
                price,
                purchased: false
            });
        }

        resetForm();
        saveItems();
        render();
        nameInput.focus();
    });

    function resetForm() {
        editingId = null;
        form.reset();
        addBtn.textContent = "Add";
    }

    markAllBtn.addEventListener("click", () => {
        if (items.length === 0) {
            alert("Your shopping list is empty.");
            return;
        }

        items.forEach(item => {
            item.purchased = true;
        });

        saveItems();
        render();
    });

    clearBtn.addEventListener("click", () => {
        if (items.length === 0) {
            alert("Your shopping list is already empty.");
            return;
        }

        if (!confirm("Clear your entire shopping list?")) return;

        items = [];
        resetForm();
        saveItems();
        render();
    });

    render();
});