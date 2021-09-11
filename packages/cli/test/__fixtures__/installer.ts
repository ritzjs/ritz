import {RecipeBuilder} from "@ritzjs/installer"

// eslint-disable-next-line import/no-default-export
export default RecipeBuilder()
  .setName("test")
  .setDescription("test package")
  .setOwner("ritz@ritzjs.com")
  .setRepoLink("https://github.com/ritz-js/ritz")
  .build()
