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
    userid INT,
    status VARCHAR(50),
    FOREIGN KEY (fridgeitemid) REFERENCES fridgeitems(fridgeitemid),
    FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_groupinvitations_updated_at
BEFORE UPDATE ON GroupInvitations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION add_expiry_alert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO ExpiryAlerts (fridgeitemid, alertdate, userid, status)
    VALUES (NEW.fridgeitemid, NEW.expirydate - INTERVAL '3 days', NEW.userid, 'pending');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_expiry_alert_trigger
AFTER INSERT ON fridgeitems
FOR EACH ROW
EXECUTE FUNCTION add_expiry_alert();
