// Simple JSON Database for House Listings and Users
// Uses localStorage for client-side storage

const DB_KEY = 'locationMaisonDB';
const USER_DB_KEY = 'locationMaisonUsersDB';
const SESSION_KEY = 'locationMaisonSession';

// Initialize database structure
function initDatabase() {
    if (!localStorage.getItem(DB_KEY)) {
        const initialDB = {
            houses: [],
            lastId: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
    }
    
    // Initialize users database
    if (!localStorage.getItem(USER_DB_KEY)) {
        const initialUserDB = {
            users: [],
            lastUserId: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(USER_DB_KEY, JSON.stringify(initialUserDB));
    }
}

// Get all houses
function getAllHouses() {
    initDatabase();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    return db.houses || [];
}

// Get house by ID
function getHouseById(id) {
    const houses = getAllHouses();
    return houses.find(house => house.id === parseInt(id));
}

// Add a new house
function addHouse(houseData) {
    initDatabase();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    
    // Get current user ID
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('Vous devez être connecté pour ajouter une maison');
    }
    
    const newHouse = {
        id: ++db.lastId,
        userId: currentUser.id, // Link house to user
        ...houseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'available'
    };
    
    db.houses.push(newHouse);
    db.updatedAt = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    
    return newHouse;
}

// Update a house
function updateHouse(id, houseData) {
    initDatabase();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    
    const index = db.houses.findIndex(house => house.id === parseInt(id));
    if (index === -1) {
        return null;
    }
    
    db.houses[index] = {
        ...db.houses[index],
        ...houseData,
        updatedAt: new Date().toISOString()
    };
    
    db.updatedAt = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    
    return db.houses[index];
}

// Delete a house
function deleteHouse(id) {
    initDatabase();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    
    const index = db.houses.findIndex(house => house.id === parseInt(id));
    if (index === -1) {
        return false;
    }
    
    db.houses.splice(index, 1);
    db.updatedAt = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    
    return true;
}

// Search houses
function searchHouses(filters = {}) {
    let houses = getAllHouses();
    
    if (filters.city) {
        houses = houses.filter(house => 
            house.city.toLowerCase().includes(filters.city.toLowerCase())
        );
    }
    
    if (filters.propertyType) {
        houses = houses.filter(house => 
            house.propertyType === filters.propertyType
        );
    }
    
    if (filters.maxPrice) {
        houses = houses.filter(house => 
            parseFloat(house.price) <= parseFloat(filters.maxPrice)
        );
    }
    
    if (filters.minBedrooms) {
        houses = houses.filter(house => 
            parseInt(house.bedrooms) >= parseInt(filters.minBedrooms)
        );
    }
    
    if (filters.status) {
        houses = houses.filter(house => house.status === filters.status);
    }
    
    return houses;
}

// Export database to JSON file
function exportDatabase() {
    initDatabase();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-maison-db-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import database from JSON file
function importDatabase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedDB = JSON.parse(e.target.result);
                
                // Validate structure
                if (!importedDB.houses || !Array.isArray(importedDB.houses)) {
                    throw new Error('Invalid database format');
                }
                
                // Merge with existing or replace
                const currentDB = JSON.parse(localStorage.getItem(DB_KEY) || '{"houses":[],"lastId":0}');
                const mergedDB = {
                    houses: [...currentDB.houses, ...importedDB.houses],
                    lastId: Math.max(currentDB.lastId || 0, importedDB.lastId || 0),
                    createdAt: currentDB.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                localStorage.setItem(DB_KEY, JSON.stringify(mergedDB));
                resolve(mergedDB);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Clear all data
function clearDatabase() {
    localStorage.removeItem(DB_KEY);
    initDatabase();
}

// Get database stats
function getDatabaseStats() {
    initDatabase();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    return {
        totalHouses: db.houses.length,
        availableHouses: db.houses.filter(h => h.status === 'available').length,
        createdAt: db.createdAt,
        updatedAt: db.updatedAt
    };
}

// ========== USER MANAGEMENT ==========

// Register a new user
function registerUser(userData) {
    initDatabase();
    const userDB = JSON.parse(localStorage.getItem(USER_DB_KEY));
    
    // Check if email already exists
    const existingUser = userDB.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
    }
    
    const newUser = {
        id: ++userDB.lastUserId,
        fullName: userData.fullName,
        email: userData.email.toLowerCase(),
        password: userData.password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    userDB.users.push(newUser);
    userDB.updatedAt = new Date().toISOString();
    localStorage.setItem(USER_DB_KEY, JSON.stringify(userDB));
    
    return newUser;
}

// Login user
function loginUser(email, password) {
    initDatabase();
    const userDB = JSON.parse(localStorage.getItem(USER_DB_KEY));
    
    const user = userDB.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    if (!user) {
        return null;
    }
    
    // Create session
    const session = {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    
    return { ...user, password: undefined }; // Don't return password
}

// Logout user
function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
}

// Get current logged-in user
function getCurrentUser() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) {
        return null;
    }
    
    try {
        const sessionData = JSON.parse(session);
        initDatabase();
        const userDB = JSON.parse(localStorage.getItem(USER_DB_KEY));
        const user = userDB.users.find(u => u.id === sessionData.userId);
        
        if (!user) {
            logoutUser();
            return null;
        }
        
        return { ...user, password: undefined };
    } catch (error) {
        logoutUser();
        return null;
    }
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Get user by ID
function getUserById(userId) {
    initDatabase();
    const userDB = JSON.parse(localStorage.getItem(USER_DB_KEY));
    const user = userDB.users.find(u => u.id === parseInt(userId));
    return user ? { ...user, password: undefined } : null;
}

// Get houses by user ID
function getHousesByUserId(userId) {
    const houses = getAllHouses();
    return houses.filter(house => house.userId === parseInt(userId));
}

// Initialize on load
if (typeof window !== 'undefined') {
    initDatabase();
}

