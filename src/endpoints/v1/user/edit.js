const { errorMessage, apiMessage } = require('../../../logger.js');
const { apiKey } = require('../../../apiKey.js');
const express = require('express');
const fs = require('fs');

module.exports = (app) => {
  app.use(express.json());
  app.patch('/v1/user/edit', async (req, res) => {
    try {
      if (!apiKey(req.headers)) {
        apiMessage(
          '/v1/user/edit',
          `has been triggered by ${req.headers['x-forwarded-for']} using key ${req.headers.key} but the key was invalid`
        );
        return res.status(403).json({ success: false, cause: 'Invalid API-Key' });
      }
      apiMessage(
        '/v1/user/edit',
        `has been triggered by ${req.headers['x-forwarded-for']} using key ${req.headers.key}`
      );
      const userId = req.query.id;
      if (!userId) return res.status(400).send({ success: false, cause: 'No user id provided' });
      var userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
      if (userData[userId]) {
        var newData = req.body;
        if (!newData) {
          return res.status(400).send({ success: false, cause: 'No user data provided' });
        }
        userData[userId] = newData;
        fs.writeFileSync('userData.json', JSON.stringify(userData));
        return res.status(200).send({ success: true, info: `${userId} has been edited` });
      } else {
        return res.status(404).send({ success: false, cause: 'User not found' });
      }
    } catch (error) {
      errorMessage(error);
      return res.status(500).send({ success: false, cause: 'Internal server error' });
    }
  });
};