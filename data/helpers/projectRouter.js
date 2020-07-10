const express = require("express");

const Projects = require("./projectModel.js");

const router = express.Router();

router.get("/", (req, res) => {
    Projects.get()
        .then((project) => {
            res.status(200).json(project)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/:id', validateProjectId, (req, res) => {
    const {id} = req.params;

    Projects.get(id)
      .then((project) => {
        res.status(200).json(project);
      })
      .catch((err) => {
        console.log(err);
      })
});

router.get('/:id/actions', validateProjectId, (req, res) => {
    const {id} = req.params;

    Projects.getProjectActions(id)
    .then((project) => {
        res.status(200).json(project);
      })
      .catch((err) => {
        console.log(err);
      })
})

router.post('/', validateProject, (req, res) => {
    const projectBody = req.body;

    Projects.insert(projectBody)
        .then((project) => {
            res.status(201).json(project)
    })
    .catch((err) => {
      console.log(err);
        res.status(500).json({error: "There was an error in adding a new project"})
    })
})

router.delete("/:id", validateProjectId, async (req, res) => {
    const {id} = req.params;

    await Projects.get(id)
    .then((project) => {
      if (Object.keys(project).length > 0 ) {
        Projects.remove(id)
          .then((response) => {
            res.status(200).json(project)
          })
          .catch((err) => {
            console.log(err)
            res.status(500).json({message: "Project cannot be deleted"})
          })
      }
      else {
        res.status(400).json({message: "Cannot find project"})
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({message: "Error in deleting project"})
    })

})

router.put('/:id', validateProject, validateProjectId, (req, res) => {
    const {name} = req.body;
    const {id} = req.params;

    Projects.update(id, {name})
      .then(() => {
        Projects.get(id)
          .then((project) => {
            res.status(200).json(project)
          })
      })
      .catch((err) => {
        res.status(500).json({message: "Error in updating the project"})
      })
})

function validateProject(req, res, next) {
    const projectBody = req.body
    console.log(projectBody)

    if (Object.keys(req.body).length === 0 ) {
        res.status(400).json({ message: "missing project data" });
      }
      else if ((projectBody).length == 0) {
        res.status(400).json({ message: "missing required field" });
      }
      else {
        next();
      }
}

function validateProjectId(req, res, next) {
    const {id} = req.params

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

module.exports = router;
