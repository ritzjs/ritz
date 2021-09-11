import {RecipeBuilder} from "@ritzjs/installer"
import {join} from "path"

export default RecipeBuilder()
  .setName("Render.com")
  .setDescription("")
  .setOwner("republicproductions@protonmail.com")
  .setRepoLink("https://github.com/ritz-js/ritz")
  .addNewFilesStep({
    stepId: "addRenderConfig",
    stepName: "Add render.yaml",
    explanation: `NOTE: Your app must be configured to use Postgres for this render.yaml config`,
    targetDirectory: ".",
    templatePath: join(__dirname, "templates"),
    templateValues: {},
  })
  .build()
