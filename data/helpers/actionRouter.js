const express = require("express");

const Actions = require("./actionModel.js");
const Projects = require("./projectModel.js");

const router = express.Router();

router.get("/", (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({ errorMessage: "There was ane error retrieving the data." });
        });
});

router.get('/:id', validateActionId, (req, res) => {
    const {id} = req.params;

    Actions.get(id)
      .then((action) => {
        res.status(200).json(action);
      })
      .catch((err) => {
        console.log(err);
      })
});

router.get('/:id/actions', validateActionId, (req, res) => {
    const {id} = req.params;

    Actions.getProjectActions(id)
    .then((action) => {
        res.status(200).json(action);
      })
      .catch((err) => {
        console.log(err);
      })
})

router.post('/', validateProjectId, validateAction, (req, res) => {
    const actionBody = req.body;

    Actions.insert(actionBody)
        .then((action) => {
            res.status(201).json(action)
    })
    .catch((err) => {
      console.log(err);
        res.status(500).json({error: "There was an error in adding a new action"})
    })
})

router.delete("/:id", validateActionId, async (req, res) => {
    const {id} = req.params;

    await Actions.get(id)
    .then((action) => {
      if (Object.keys(action).length > 0 ) {
        Actions.remove(id)
          .then((response) => {
            res.status(200).json(action)
          })
          .catch((err) => {
            console.log(err)
            res.status(500).json({message: "Action cannot be deleted"})
          })
      }
      else {
        res.status(400).json({message: "Cannot find action"})
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({message: "Error in deleting action"})
    })

})

router.put('/:id', validateAction, validateActionId, (req, res) => {
    const changes = req.body;
    const {id} = req.params;

    Actions.update(id, changes)
      .then(() => {
        Actions.get(id)
          .then((action) => {
            res.status(200).json(action)
          })
      })
      .catch((err) => {
        res.status(500).json({message: "Error in updating the action"})
      })
})

function validateAction(req, res, next) {
    const actionBody = req.body

    if (Object.keys(req.body).length === 0 ) {
        res.status(400).json({ message: "missing action data" });
      }
      else if ((actionBody).length == 0) {
        res.status(400).json({ message: "missing required field" });
      }
      else {
        next();
      }
}

function validateActionId(req, res, next) {
    const {id} = req.params

    Actions.get(id)
      .then(action => {
        if (action != null) {
          req.action = action;
          next()
        }
        else {
          res.status(400).json({message: "Invalid action id"})
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Cannnot get action id" });
      });
  }

  function validateProjectId(req, res, next) {
    const {id} = req.params
    const {project_id} = req.body


    if (project_id == null) {
        res.status(400).json({message: "Please include a project ID"})
    }
    else {
        Projects.get(id)
        .then(project => {
            if (project != null) {
            req.project = project;
            next()
            }
            else {
            res.status(400).json({message: "Invalid project id"})
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Cannnot get project id" });
        });
    }
  }

module.exports = router;
