-- Bảng Users
CREATE TABLE Users (
    UserId SERIAL PRIMARY KEY,
    Username VARCHAR(100),
    Email VARCHAR(100),
    Password VARCHAR(255)
);
-- Bảng Groups
CREATE TABLE Groups (
    GroupId SERIAL PRIMARY KEY,
    GroupName VARCHAR(100)
);
-- Bảng Group_User
CREATE TABLE Group_User (
    UserId INT,
    GroupId INT,
    IsOwner BOOLEAN DEFAULT FALSE,
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
CREATE TABLE IF NOT EXISTS GroupInvitations (
    invitationId SERIAL PRIMARY KEY,
    senderid INT NOT NULL,
    groupid INT NOT NULL,
    receiverid INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderid) REFERENCES Users(userid),
    FOREIGN KEY (receiverid) REFERENCES Users(userid),
    FOREIGN KEY (groupid) REFERENCES Groups(groupid)
);
CREATE TABLE IF NOT EXISTS ExpiryAlerts (
    alertid SERIAL PRIMARY KEY,
    fridgeitemid INT,
    alertdate DATE,
    groupid INT,
    userid INT,
    status VARCHAR(50),
    FOREIGN KEY (fridgeitemid) REFERENCES fridgeitems(fridgeitemid),
    FOREIGN KEY (userid) REFERENCES users(userid)
);
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updatedAt = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_groupinvitations_updated_at BEFORE
UPDATE ON GroupInvitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE FUNCTION add_expiry_alert() RETURNS TRIGGER AS $$
DECLARE user_rec RECORD;
BEGIN FOR user_rec IN
SELECT userid
FROM group_user
WHERE groupid = NEW.groupid LOOP
INSERT INTO ExpiryAlerts (fridgeitemid, alertdate, groupid, userid, status)
VALUES (
        NEW.fridgeitemid,
        NEW.expirydate - INTERVAL '3 days',
        NEW.groupid,
        user_rec.userid,
        'pending'
    );
END LOOP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER add_expiry_alert_trigger
AFTER
INSERT ON fridgeitems FOR EACH ROW EXECUTE FUNCTION add_expiry_alert();
-- thêm người dùng vào nhóm
CREATE OR REPLACE FUNCTION add_user_to_group() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.group_user(groupid, userid)
SELECT NEW.groupid,
    NEW.receiverid
WHERE NEW.status = 'accept';
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE or replace TRIGGER trg_add_user_to_group
AFTER
UPDATE OF status ON public.groupinvitations FOR EACH ROW EXECUTE FUNCTION add_user_to_group();
-- Bảng Users
INSERT INTO Users (Username, Email, Password)
VALUES (
        'john_doe',
        'john.doe@example.com',
        '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'
    ),
    (
        'jane_smith',
        'jane.smith@example.com',
        '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'
    ),
    (
        'alice_wonderland',
        'alice.wonderland@example.com',
        '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'
    ),
    (
        'bob_marley',
        'bob.marley@example.com',
        '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'
    ),
    (
        'jennifer_aniston',
        'jennifer.aniston@example.com',
        '$2b$10$DGGMlJkszser9vX3J/X1Ou5C3jHLFNk5qx2iAnF7WR70R6VK7QQC6'
    ),
    (
        'emma_watson',
        'emma.watson@example.com',
        '123456'
    ),
    (
        'david_beckham',
        'david.beckham@example.com',
        '123456'
    ),
    (
        'lisa_kudrow',
        'lisa.kudrow@example.com',
        '123456'
    ),
    ('brad_pitt', 'brad.pitt@example.com', '123456');
-- Bảng Groups
INSERT INTO Groups (GroupId, GroupName)
VALUES (1, 'FamilyNo1'),
    (2, 'FamilyNo2'),
    (3, 'FamilyNo3'),
    (4, 'FamilyNo4'),
    (5, 'FamilyNo5'),
    (6, 'FamilyNo6');
-- Bảng Group_User
INSERT INTO Group_User (UserId, GroupId, IsOwner)
VALUES (1, 1, true),
    (2, 1, false),
    (3, 2, true),
    (4, 2, false),
    (5, 3, true),
    (6, 3, false),
    (7, 4, true),
    (8, 4, false),
    (9, 4, false);
-- Bảng Items
INSERT INTO Items (ItemName, TimeExpired)
VALUES ('Milk', 7),
    ('Eggs', 21),
    ('Beef', 3),
    ('Chicken', 2),
    ('Fish', 2),
    ('Pork', 3),
    ('Bacon', 7),
    ('Sausage', 7),
    ('Bread', 7),
    ('Butter', 60),
    ('Cheese (Hard)', 60),
    ('Cheese (Soft)', 14),
    ('Yogurt', 14),
    ('Lettuce', 7),
    ('Spinach', 5),
    ('Carrots', 30),
    ('Broccoli', 7),
    ('Potatoes', 60),
    ('Onions', 30),
    ('Tomatoes', 7),
    ('Apples', 30),
    ('Bananas', 7),
    ('Oranges', 21),
    ('Berries', 7),
    ('Grapes', 7),
    ('Watermelon', 14),
    ('Cantaloupe', 14),
    ('Pineapple', 14),
    ('Mango', 7),
    ('Peaches', 7),
    ('Plums', 7),
    ('Cherries', 7),
    ('Avocado', 5),
    ('Bell Peppers', 7),
    ('Cucumbers', 7),
    ('Zucchini', 5),
    ('Eggplant', 7),
    ('Cauliflower', 7),
    ('Cabbage', 14),
    ('Garlic', 90),
    ('Ginger', 30),
    ('Lemons', 30),
    ('Limes', 30),
    ('Strawberries', 5),
    ('Blueberries', 7),
    ('Raspberries', 5),
    ('Blackberries', 5),
    ('Kiwi', 7),
    ('Papaya', 5),
    ('Pomegranate', 30),
    ('Coconut', 30),
    ('Apricots', 7),
    ('Nectarines', 7),
    ('Honeydew', 14),
    ('Pears', 14),
    ('Squash', 30),
    ('Corn', 5),
    ('Green Beans', 7),
    ('Peas', 7),
    ('Radishes', 14),
    ('Beets', 14),
    ('Turnips', 14),
    ('Parsnips', 30),
    ('Sweet Potatoes', 30),
    ('Celery', 14),
    ('Mushrooms', 7),
    ('Asparagus', 5),
    ('Brussels Sprouts', 5),
    ('Leeks', 14),
    ('Scallions', 7),
    ('Rhubarb', 7),
    ('Fennel', 7),
    ('Artichokes', 5),
    ('Kale', 7),
    ('Swiss Chard', 7),
    ('Collard Greens', 7),
    ('Mustard Greens', 7),
    ('Dandelion Greens', 7),
    ('Arugula', 5),
    ('Endive', 5),
    ('Escarole', 5),
    ('Radicchio', 7),
    ('Bok Choy', 7),
    ('Napa Cabbage', 14),
    ('Mint', 7),
    ('Basil', 7),
    ('Parsley', 7),
    ('Cilantro', 7),
    ('Dill', 7),
    ('Rosemary', 14),
    ('Thyme', 14),
    ('Sage', 14),
    ('Oregano', 14),
    ('Tarragon', 7),
    ('Chives', 7),
    ('Marjoram', 14),
    ('Bay Leaves', 365),
    ('Olives', 30),
    ('Pickles', 60),
    ('Kimchi', 60),
    ('Sauerkraut', 60),
    ('Tofu', 7),
    ('Tempeh', 14),
    ('Seitan', 14),
    ('Soy Milk', 7),
    ('Almond Milk', 7),
    ('Coconut Milk', 7),
    ('Rice Milk', 7),
    ('Oat Milk', 7),
    ('Nut Butter', 180),
    ('Jam', 30),
    ('Jelly', 30),
    ('Honey', 365),
    ('Maple Syrup', 365),
    ('Peanut Butter', 180),
    ('Almond Butter', 180),
    ('Cashew Butter', 180),
    ('Tahini', 180),
    ('Molasses', 365),
    ('Agave Nectar', 180),
    ('Coconut Sugar', 365),
    ('Brown Sugar', 365),
    ('White Sugar', 365),
    ('Powdered Sugar', 365),
    ('Corn Syrup', 365),
    ('Chocolate Syrup', 180),
    ('Hot Sauce', 365),
    ('Soy Sauce', 365),
    ('Worcestershire Sauce', 365),
    ('Barbecue Sauce', 180),
    ('Ketchup', 180),
    ('Mustard', 180),
    ('Mayonnaise', 60),
    ('Salad Dressing', 60),
    ('Vinegar', 365),
    ('Cooking Oil', 180),
    ('Olive Oil', 180),
    ('Coconut Oil', 180),
    ('Canola Oil', 180),
    ('Sesame Oil', 180),
    ('Peanut Oil', 180),
    ('Vegetable Oil', 180),
    ('Butter', 60),
    ('Margarine', 180),
    ('Lard', 180),
    ('Shortening', 180),
    ('Baking Powder', 365),
    ('Baking Soda', 365),
    ('Cornstarch', 365),
    ('Flour', 180),
    ('Rice', 365),
    ('Pasta', 365),
    ('Beans (Dry)', 365),
    ('Lentils', 365),
    ('Quinoa', 365),
    ('Oats', 180),
    ('Granola', 180),
    ('Cereal', 180),
    ('Crackers', 180),
    ('Chips', 60),
    ('Popcorn', 180),
    ('Pretzels', 180),
    ('Cookies', 60),
    ('Candy', 180),
    ('Chocolate', 180),
    ('Ice Cream', 60),
    ('Frozen Vegetables', 365),
    ('Frozen Fruit', 365),
    ('Frozen Meals', 180),
    ('Salmon', 2),
    ('Tuna', 2),
    ('Cod', 2),
    ('Halibut', 2),
    ('Tilapia', 2),
    ('Trout', 2),
    ('Shrimp', 2),
    ('Scallops', 2),
    ('Crab', 2),
    ('Lobster', 2),
    ('Mussels', 2),
    ('Clams', 2),
    ('Oysters', 2);
-- Bảng ShoppingItems
INSERT INTO ShoppingItems (Quantity, DateAdded, Status, ItemId, GroupId)
VALUES (2, '2024-05-21', TRUE, 1, 1),
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
    (2, '2024-05-26', TRUE, 3, 5),
    (1, '2024-05-26', FALSE, 4, 1),
    (2, '2024-05-26', FALSE, 4, 2),
    (3, '2024-05-26', TRUE, 5, 3),
    (1, '2024-05-26', FALSE, 6, 4),
    (2, '2024-05-26', TRUE, 7, 5),
    (3, '2024-05-26', FALSE, 8, 6),
    (2, '2024-05-27', TRUE, 9, 1),
    (1, '2024-05-27', FALSE, 10, 2);
-- Bảng FridgeItems
-- Bảng CookingPlans
INSERT INTO CookingPlans (Date, MealType, GroupId)
VALUES ('2024-05-19', 'dinner', 1),
    ('2024-05-19', 'lunch', 1),
    ('2024-05-20', 'dinner', 2),
    ('2024-05-20', 'lunch', 2),
    ('2024-05-21', 'breakfast', 3),
    ('2024-05-21', 'dinner', 3),
    ('2024-05-22', 'lunch', 4),
    ('2024-05-23', 'dinner', 5),
    ('2024-05-19', 'dinner', 4),
    ('2024-05-19', 'lunch', 4),
    ('2024-05-20', 'dinner', 5),
    ('2024-05-20', 'lunch', 5);
-- Bảng Recipes
INSERT INTO Recipes (RecipeName, Instructions)
VALUES (
        'Grilled Chicken Salad',
        'Grill the chicken breast, chop the lettuce, tomatoes, and cucumbers. Mix all ingredients together with a dressing of olive oil and vinegar.'
    ),
    (
        'Beef Stir-Fry',
        'Slice the beef into thin strips. Stir-fry with broccoli, bell peppers, onions, and soy sauce. Serve with rice.'
    ),
    (
        'Fruit Salad',
        'Chop apples, bananas, strawberries, and blueberries. Mix together in a bowl and drizzle with honey.'
    ),
    (
        'Garlic Butter Shrimp',
        'Saute shrimp in a pan with minced garlic and butter. Serve with a side of steamed asparagus.'
    ),
    (
        'Tomato Basil Soup',
        'Cook tomatoes with garlic, onions, and basil. Blend the mixture until smooth and serve hot.'
    ),
    (
        'Avocado Toast',
        'Toast the bread and spread mashed avocado on top. Sprinkle with salt and pepper.'
    ),
    (
        'Eggplant Parmesan',
        'Bread and fry eggplant slices, then layer them with marinara sauce and cheese. Bake until golden.'
    ),
    (
        'Peach Smoothie',
        'Blend peaches, yogurt, and a splash of coconut milk until smooth. Serve chilled.'
    ),
    (
        'Spaghetti Carbonara',
        'Cook spaghetti and toss with cooked bacon, beaten eggs, and grated cheese.'
    ),
    (
        'Chicken Caesar Salad',
        'Grill chicken breast and slice. Mix with chopped romaine lettuce, croutons, parmesan cheese, and Caesar dressing.'
    ),
    (
        'Mango Salsa',
        'Chop mango, bell peppers, onions, and cilantro. Mix together with lime juice and salt.'
    ),
    (
        'Beef Tacos',
        'Cook ground beef with onions and spices. Serve in taco shells with lettuce, cheese, and tomatoes.'
    ),
    (
        'Baked Salmon',
        'Season salmon with salt, pepper, and lemon juice. Bake in the oven until cooked through.'
    ),
    (
        'Vegetable Stir-Fry',
        'Stir-fry broccoli, carrots, bell peppers, and snow peas in sesame oil. Serve with rice.'
    ),
    (
        'Omelette',
        'Whisk eggs and pour into a hot pan. Add cheese, bell peppers, and mushrooms. Fold and cook until set.'
    ),
    (
        'Banana Pancakes',
        'Mash bananas and mix with eggs and flour. Cook on a griddle until golden brown.'
    ),
    (
        'Caprese Salad',
        'Slice tomatoes and mozzarella cheese. Layer with fresh basil leaves and drizzle with olive oil.'
    ),
    (
        'Stuffed Bell Peppers',
        'Halve and hollow out bell peppers. Stuff with a mixture of cooked rice, ground beef, and cheese. Bake until peppers are tender.'
    ),
    (
        'Garlic Lemon Shrimp Pasta',
        'Cook pasta and toss with sauteed shrimp, garlic, and lemon juice. Top with parsley.'
    ),
    (
        'Apple Pie',
        'Peel and slice apples. Mix with sugar, cinnamon, and a bit of flour. Fill pie crust and bake until golden.'
    ),
    (
        'Broccoli Cheddar Soup',
        'Cook broccoli with onions and garlic in chicken broth. Add cheddar cheese and blend until smooth.'
    ),
    (
        'Chicken Fajitas',
        'Cook sliced chicken with bell peppers and onions. Serve with tortillas and toppings.'
    ),
    (
        'Greek Salad',
        'Mix chopped cucumbers, tomatoes, onions, olives, and feta cheese. Dress with olive oil and vinegar.'
    ),
    (
        'Sweet Potato Fries',
        'Cut sweet potatoes into fries. Toss with olive oil, salt, and pepper. Bake until crispy.'
    ),
    (
        'Tuna Salad',
        'Mix canned tuna with chopped celery, onions, and mayonnaise. Serve on a bed of lettuce.'
    ),
    (
        'Beef Stew',
        'Cook beef with potatoes, carrots, onions, and beef broth until tender.'
    ),
    (
        'Cauliflower Rice',
        'Grate cauliflower into small pieces. Saute with garlic and olive oil until tender.'
    ),
    (
        'Chicken Alfredo',
        'Cook pasta and toss with grilled chicken and Alfredo sauce.'
    ),
    (
        'Guacamole',
        'Mash avocados with lime juice, onions, tomatoes, and cilantro.'
    ),
    (
        'Berry Smoothie',
        'Blend strawberries, blueberries, and yogurt until smooth. Serve chilled.'
    ),
    (
        'Vegetable Soup',
        'Cook carrots, potatoes, onions, and celery in vegetable broth until tender.'
    ),
    (
        'Apple Crumble',
        'Peel and slice apples. Top with a mixture of oats, flour, brown sugar, and butter. Bake until golden.'
    ),
    (
        'Chicken Noodle Soup',
        'Cook chicken with carrots, celery, onions, and noodles in chicken broth.'
    ),
    (
        'Egg Fried Rice',
        'Scramble eggs and mix with cooked rice, peas, carrots, and soy sauce.'
    ),
    (
        'Roasted Vegetable Medley',
        'Chop and roast potatoes, carrots, bell peppers, and zucchini with olive oil and herbs.'
    ),
    (
        'Shrimp Scampi',
        'Saute shrimp with garlic, lemon juice, and butter. Serve over pasta.'
    ),
    (
        'Tomato Basil Bruschetta',
        'Chop tomatoes and basil. Mix with olive oil and garlic. Serve on toasted bread slices.'
    ),
    (
        'Vegetarian Chili',
        'Cook beans, tomatoes, onions, bell peppers, and corn with chili spices.'
    ),
    (
        'Mango Chicken',
        'Cook chicken with mango slices and a touch of soy sauce. Serve with rice.'
    ),
    (
        'Apple Cinnamon Oatmeal',
        'Cook oats with milk, chopped apples, and a sprinkle of cinnamon.'
    ),
    (
        'Spinach and Mushroom Quiche',
        'Mix spinach, mushrooms, eggs, and cheese. Pour into a pie crust and bake.'
    ),
    (
        'Stuffed Zucchini',
        'Halve and hollow out zucchini. Fill with a mixture of ground beef, tomatoes, and cheese. Bake until zucchini'
    );
-- Bảng CP_Recipes
INSERT INTO CP_Recipes (CookingPlanId, RecipeId, Status)
VALUES (1, 1, FALSE),
    (1, 4, TRUE),
    (1, 2, FALSE),
    (2, 2, TRUE),
    (3, 3, FALSE),
    (4, 4, TRUE),
    (5, 1, FALSE),
    (6, 2, TRUE),
    (7, 3, FALSE),
    (8, 4, TRUE),
    (9, 1, FALSE),
    (10, 2, TRUE),
    (11, 3, FALSE),
    (12, 4, TRUE);
-- Bảng Recipe_item
INSERT INTO Recipe_item (ItemId, RecipeId)
VALUES (4, 1),
    (14, 1),
    (20, 1),
    (35, 1),
    (137, 1),
    (135, 1),
    (3, 2),
    (17, 2),
    (34, 2),
    (19, 2),
    (128, 2),
    (151, 2),
    (21, 3),
    (22, 3),
    (44, 3),
    (45, 3),
    (113, 3),
    (176, 4),
    (40, 4),
    (10, 4),
    (67, 4),
    (20, 5),
    (40, 5),
    (19, 5),
    (86, 5),
    (9, 6),
    (33, 6),
    (37, 7),
    (12, 7),
    (9, 7),
    (30, 8),
    (13, 8),
    (107, 8),
    (152, 9),
    (7, 9),
    (2, 9),
    (11, 9),
    (4, 10),
    (14, 10),
    (11, 10),
    (134, 10),
    (29, 11),
    (34, 11),
    (19, 11),
    (88, 11),
    (43, 11),
    (3, 12),
    (19, 12),
    (14, 12),
    (12, 12),
    (20, 12),
    (170, 13),
    (43, 13),
    (17, 14),
    (16, 14),
    (34, 14),
    (59, 14),
    (140, 14),
    (151, 14),
    (2, 15),
    (11, 15),
    (34, 15),
    (66, 15),
    (22, 16),
    (2, 16),
    (150, 16),
    (20, 17),
    (12, 17),
    (86, 17),
    (137, 17),
    (34, 18),
    (151, 18),
    (3, 18),
    (11, 18),
    (152, 19),
    (176, 19),
    (40, 19),
    (43, 19),
    (87, 19),
    (21, 20),
    (122, 20),
    (150, 20),
    (17, 21),
    (19, 21),
    (40, 21),
    (11, 21),
    (4, 22),
    (34, 22),
    (19, 22),
    (35, 23),
    (20, 23),
    (19, 23),
    (98, 23),
    (11, 23),
    (137, 23),
    (135, 23),
    (64, 24),
    (137, 24),
    (171, 25),
    (65, 25),
    (19, 25),
    (133, 25),
    (14, 25),
    (3, 26),
    (18, 26),
    (16, 26),
    (19, 26),
    (38, 27),
    (40, 27),
    (137, 27),
    (152, 28),
    (4, 28),
    (130, 28),
    (33, 29),
    (43, 29),
    (19, 29),
    (20, 29),
    (88, 29),
    (44, 30),
    (45, 30),
    (13, 30),
    (16, 31),
    (18, 31),
    (19, 31),
    (65, 31),
    (21, 32),
    (156, 32),
    (150, 32),
    (122, 32),
    (10, 32),
    (4, 33),
    (16, 33),
    (65, 33),
    (19, 33),
    (152, 33),
    (2, 34),
    (151, 34),
    (59, 34),
    (16, 34),
    (128, 34),
    (18, 35),
    (16, 35),
    (34, 35),
    (36, 35),
    (137, 35),
    (176, 36),
    (40, 36),
    (43, 36),
    (10, 36),
    (152, 36),
    (20, 37),
    (86, 37),
    (137, 37),
    (40, 37),
    (9, 37),
    (153, 38),
    (20, 38),
    (19, 38),
    (34, 38),
    (57, 38),
    (4, 39),
    (29, 39),
    (128, 39),
    (151, 39),
    (21, 40),
    (156, 40),
    (1, 40),
    (15, 41),
    (66, 41),
    (2, 41),
    (11, 41),
    (150, 41),
    (36, 42),
    (3, 42),
    (20, 42),
    (11, 42);
-- Bảng FavoriteRecipes
INSERT INTO FavoriteRecipes (UserId, RecipeId)
VALUES (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 1),
    (6, 2),
    (7, 3),
    (8, 4),
    (9, 1);