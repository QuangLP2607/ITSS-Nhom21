
-- Bảng Users
CREATE TABLE Users (
    UserId SERIAL PRIMARY KEY,
    Username VARCHAR(100),
    Email VARCHAR(100),
    Password VARCHAR(255)
);

-- Bảng Groups
CREATE TABLE Groups (
    GroupId INT PRIMARY KEY,
    GroupName VARCHAR(100)
);

-- Bảng Group_User
CREATE TABLE Group_User (
    
    UserId INT,
    GroupId INT,
    PRIMARY KEY (UserId, GroupId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);

-- Bảng Items
CREATE TABLE Items (
    ItemId SERIAL PRIMARY KEY,
    ItemName VARCHAR(100),
    TimeExpired INT
);

-- Bảng ShoppingItems
CREATE TABLE ShoppingItems (
    ShoppingItemId SERIAL PRIMARY KEY,
    Quantity INT,
    DateAdded DATE,
    Status BOOLEAN,
    Note TEXT,  
    ItemId INT,
    GroupId INT,
    FOREIGN KEY (ItemId) REFERENCES Items(ItemId),
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);

-- Bảng FridgeItems
CREATE TABLE FridgeItems (
    FridgeItemId SERIAL PRIMARY KEY,
    ExpiryDate DATE,
    Quantity INT,
    ItemId INT,
    GroupId INT,
    FOREIGN KEY (ItemId) REFERENCES Items(ItemId),
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);

-- Bảng CookingPlans
CREATE TABLE CookingPlans (
    CookingPlanId SERIAL PRIMARY KEY,
    Date DATE,
    
    MealType VARCHAR(50),
    GroupId INT,
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);

-- Bảng Recipes
CREATE TABLE Recipes (
    RecipeId SERIAL PRIMARY KEY,
    RecipeName VARCHAR(100),
    Instructions TEXT
);

-- Bảng CP_Recipes
CREATE TABLE CP_Recipes (
    CookingPlanId INT,
    RecipeId INT,
    Status BOOLEAN,
    PRIMARY KEY (CookingPlanId, RecipeId),
    FOREIGN KEY (CookingPlanId) REFERENCES CookingPlans(CookingPlanId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
);

-- Bảng Recipe_item
CREATE TABLE Recipe_item (
    
    ItemId INT,
    RecipeId INT,
    PRIMARY KEY (ItemId, RecipeId),
    FOREIGN KEY (ItemId) REFERENCES Items(ItemId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
);

-- Bảng FavoriteRecipes
CREATE TABLE FavoriteRecipes (
    
    UserId INT,
    RecipeId INT,
    PRIMARY KEY (UserId, RecipeId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
);

-- Bảng Users
INSERT INTO Users (Username, Email, Password) VALUES
    ('john_doe', 'john.doe@example.com', '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'),
    ('jane_smith', 'jane.smith@example.com', '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'),
    ('alice_wonderland', 'alice.wonderland@example.com', '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'),
    ('bob_marley', 'bob.marley@example.com', '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'),
    ('jennifer_aniston', 'jennifer.aniston@example.com', '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'),
    ('emma_watson', 'emma.watson@example.com', '123456'),
    ('david_beckham', 'david.beckham@example.com', '123456'),
    ('lisa_kudrow', 'lisa.kudrow@example.com', '123456'),
    ('brad_pitt', 'brad.pitt@example.com', '123456');

-- Bảng Groups
INSERT INTO Groups (GroupId, GroupName) VALUES
    (1, 'FamilyNo1'),
    (2, 'FamilyNo2'),
    (3, 'FamilyNo3'),
    (4, 'FamilyNo4'),
    (5, 'FamilyNo5'),
    (6, 'FamilyNo6');

-- Bảng Group_User
INSERT INTO Group_User (UserId, GroupId) VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 2),
    (5, 3),
    (6, 3),
    (7, 4),
    (8, 4),
    (9, 4);

-- Bảng Items
INSERT INTO Items (ItemName, TimeExpired) VALUES
    ('Milk', 7),
    ('Eggs', 14),
    ('Bread', 3),
    ('Chicken', 2),
    ('Tomato', 5),
    ('Pasta', 30),
    ('Apples', 7),
    ('Bananas', 5),
    ('Orange Juice', 10),
    ('Salmon', 3),
    ('Rice', 90),
    ('Bell Peppers', 7),
    ('Potatoes', 14),
    ('Yogurt', 7),
    ('Cheese', 10),
    ('Onion', 7),
    ('Spinach', 5),
    ('Cereal', 30),
    ('Ground Beef', 3),
    ('Lettuce', 5),
    ('Carrots', 14),
    ('Butter', 7),
    ('Frozen Peas', 30),
    ('Olive Oil', 365),
    ('Canned Beans', 180),
    ('Cucumber', 5),
    ('Green Beans', 7),
    ('Lemon', 10),
    ('Sugar', 365),
    ('Flour', 180),
    ('Baking Powder', 365),
    ('Vanilla Extract', 365),
    ('Pineapple', 7),
    ('Strawberries', 3),
    ('Watermelon', 5),
    ('Grapes', 7),
    ('Lime', 10),
    ('Avocado', 7),
    ('Peaches', 5),
    ('Plums', 7),
    ('Kiwi', 14),
    ('Pears', 7),
    ('Blueberries', 3),
    ('Raspberries', 5),
    ('Blackberries', 7),
    ('Cherries', 7),
    ('Apricots', 5),
    ('Coconut', 14),
    ('Mango', 7),
    ('Papaya', 5),
    ('Guava', 7),
    ('Dragon Fruit', 10),
    ('Lychee', 7),
    ('Passion Fruit', 5),
    ('Star Fruit', 7),
    ('Cantaloupe', 7),
    ('Honeydew Melon', 5),
    ('Persimmon', 7),
    ('Jackfruit', 10),
    ('Rambutan', 7),
    ('Durian', 7),
    ('Tamarillo', 5),
    ('Carambola', 7),
    ('Kumquat', 7);

-- Bảng ShoppingItems
INSERT INTO ShoppingItems (Quantity, DateAdded, Status, ItemId, GroupId) VALUES
    (2, '2024-05-21', TRUE, 1, 1),
    (1, '2024-05-21', FALSE, 2, 1),
    (3, '2024-05-21', TRUE, 3, 2),
    (1, '2024-05-21', FALSE, 4, 1),
    (2, '2024-05-21', TRUE, 5, 2),
    (3, '2024-05-22', TRUE, 6, 3),
    (2, '2024-05-22', FALSE, 7, 4),
    (1, '2024-05-22', TRUE, 8, 5),
    (4, '2024-05-22', FALSE, 9, 4),
    (2, '2024-05-22', TRUE, 10, 5),
    (3, '2024-05-22', FALSE, 11, 4),
    (2, '2024-05-23', TRUE, 12, 5),
    (1, '2024-05-23', FALSE, 13, 1),
    (2, '2024-05-23', TRUE, 14, 2),
    (3, '2024-05-23', FALSE, 15, 3),
    (1, '2024-05-23', TRUE, 16, 4),
    (2, '2024-05-23', FALSE, 17, 5),
    (3, '2024-05-23', TRUE, 18, 6),
    (2, '2024-05-24', FALSE, 19, 1),
    (1, '2024-05-24', FALSE, 20, 2),
    (2, '2024-05-24', FALSE, 21, 1),
    (1, '2024-05-24', TRUE, 22, 1),
    (3, '2024-05-24', FALSE, 23, 2),
    (1, '2024-05-24', TRUE, 24, 1),
    (2, '2024-05-24', FALSE, 25, 2),
    (3, '2024-05-25', TRUE, 26, 3),
    (2, '2024-05-25', FALSE, 27, 4),
    (1, '2024-05-25', FALSE, 28, 5),
    (4, '2024-05-25', FALSE, 29, 4),
    (2, '2024-05-25', FALSE, 1, 5),
    (3, '2024-05-26', TRUE, 2, 4),
    (2, '2024-05-26', TRUE,3, 5),
    (1, '2024-05-26', FALSE, 4, 1),
    (2, '2024-05-26', FALSE, 4, 2),
    (3, '2024-05-26', TRUE, 5, 3),
    (1, '2024-05-26', FALSE, 6, 4),
    (2, '2024-05-26', TRUE, 7, 5),
    (3, '2024-05-26', FALSE, 8, 6),
    (2, '2024-05-27',TRUE, 9, 1),
    (1, '2024-05-27', FALSE, 10, 2);

-- Bảng FridgeItems


-- Bảng CookingPlans
INSERT INTO CookingPlans (Date, MealType, GroupId) VALUES
    ('2024-05-19','dinner', 1),
    ('2024-05-19','lunch', 1),
    ('2024-05-20','dinner', 2),
    ('2024-05-20','lunch', 2),
    ('2024-05-21','breakfast', 3),
    ('2024-05-21','dinner', 3),
    ('2024-05-22', 'lunch', 4),
    ('2024-05-23','dinner', 5),
    ('2024-05-19','dinner', 4),
    ('2024-05-19','lunch', 4),
    ('2024-05-20','dinner', 5),
    ('2024-05-20','lunch', 5);
    
-- Bảng Recipes
INSERT INTO Recipes (RecipeName,Instructions) VALUES
    ('Apple Pie','1. Peel and slice apples. 2. Mix with sugar. 3. Prepare pie crust. 4. Bake.'),
    ('Banana Smoothie', '1. Blend bananas and yogurt. 2. Add honey. 3. Blend until smooth.'),
    ('Grilled Salmon','1. Marinate salmon in lemon juice and olive oil. 2. Grill until cooked. 3. Garnish with garlic.'),
    ('Chicken Curry','1. Cook chicken in curry paste. 2. Add coconut milk. 3. Simmer with vegetables.');

-- Bảng CP_Recipes
INSERT INTO CP_Recipes (CookingPlanId, RecipeId ,Status) VALUES
    (1, 1,FALSE),
    (1, 4,TRUE),
    (1, 2,FALSE),
    (2, 2,TRUE),
    (3, 3,FALSE),
    (4, 4,TRUE),
    (5, 1,FALSE),
    (6, 2,TRUE),
    (7, 3,FALSE),
    (8, 4,TRUE),
    (9, 1,FALSE),
    (10, 2,TRUE),
    (11, 3,FALSE),
    (12, 4,TRUE);

-- Bảng Recipe_item
INSERT INTO Recipe_item (ItemId, RecipeId) VALUES
    (7, 1),
    (28, 1),
    (29, 1),
    (21, 1),
    (8, 2),
    (14, 2),
    (15, 2),
    (10, 3),
    (27, 3),
    (23, 3),
    (4, 4),
    (1, 4),
    (13, 4),
    (9, 4);

-- Bảng FavoriteRecipes
INSERT INTO FavoriteRecipes (UserId, RecipeId) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 1),
    (6, 2),
    (7, 3),
    (8, 4),
    (9, 1);




