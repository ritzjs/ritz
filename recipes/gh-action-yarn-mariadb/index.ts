import {RecipeBuilder} from "@ritzjs/installer"
import {join} from "path"

export default RecipeBuilder()
  .setName("Github Action Workflow For Yarn & MariaDB")
  .setDescription("This Github Action config will build and test your ritz app on each push")
  .setOwner("me@kevinlangleyjr.com")
  .setRepoLink("https://github.com/ritz-js/ritz")
  .addNewFilesStep({
    stepId: "addWorkflow",
    stepName: "Add .github/workflows/main.yml",
    explanation: `NOTE: Your app must be configured to use MariaDB for this`,
    targetDirectory: ".github/workflows/",
    templatePath: join(__dirname, "templates"),
    templateValues: {},
  })
  .build()
