const express = require("express");
const router = express.Router();
const db = require('../db');

<<<<<<< HEAD

=======
router.get("/", (request, response) => {
  
    response.render('lobby', {
        title: 'lobby',
        messages: [
          {
            id: 1,
            timestamp: " 21:03",
            content: 'hello',
          },
          {
            id: 2,
            timestamp: ` 21:05 `,
            content: "hey",
          },
          {
            id: 3,
            timestamp: `21:05 `,
            content: "yo",
          },
          {
            id: 4,
            timestamp: `21:05 `,
            content: "dfjsafkjslfjsalfjs;fjsfjsl sjfklsjflsd sdjfklsjflk sjflks fljs sdjklf slfkj  sjdklf sdl :)",
          }
        ]
      });
   
    });

module.exports = router;
>>>>>>> development

