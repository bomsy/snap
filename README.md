# trail
Keeps and manages a trail of package dependency changes

### About
It takes a snapshot of the current state of all the dependency packages after an install or
update of packages. This keeps a trail of dependency changes over time.

Then allows the user to go back or forwards through the package dependency trails to track changes.

If an `npm install` , `yarn install`, `npm update`, `yarn add` etc updates a package that breaks your app this allows us back up
and easily find the culprit dependency.

This works for both Yarn and npm5

### Getting Started

  `npm install -g trail`

### Using trail

 In your project, run `trail init` to setup trail, start tracking and taking snapshots

### API

### How trail works

### Contribute
