### How to Use
Install dependencies with `npm i`.  Make sure you have the latest node version (10.16.0).  Use the below commands afterwards.

#### Available Commands
`npm run findDisallowed`
Prints a list of users with blacklisted usernames.

`npm run resolveDisallowed:dryrun`
Prints a list of users with disallowed names, and what the name would be changed to.

`npm run resolveDisallowed`
Resolves all users with disallowed names.

`npm run resolveDuplicates:dryrun`
Prints a list of users with duplicate names, and what the new username would be.

`npm run resolveDuplicates`
Resolves all users with duplicate names (not including disallowed names).

### Intended Resolution
Some resolution behaviors are not defined in the instructions, so examples are given below
- `foo` & `foo` becomes `foo` and `foo1` (example)
- `foo1` & `foo1` becomes `foo1` and `foo2`
- `foo`, `foo` & `foo5` becomes `foo6`, `foo7` & `foo5`
- `foo`, `foo` & `foo1` becomes `foo2`, `foo3` & `foo1`
- `foo1`, `foo1` & `foo` becomes `foo1`, `foo2` & `foo`

### Problem Overview and Approach
Given the nature of the issue, the following questions come up to me in terms of design and scale:
- How many entries are there to process?
- Is this a one-off job? How would it be executed?

For the number of entries, it has a short blacklist, and a lot of usernames.  There are 10k in the file, but this could be clipped and include an even larger number.  So, all the updates *should* be performed in a single transaction.  After getting too far in, it was unclear whether or not the node-sqlite3 package supports transactions properly, so the current implementation has the danger of being unable to rollback if it fails mid-batch.

The nature of the problem leads to a one-time fix, but its possible that the script will need to be called again in the future, so I structured it in a way that it is easy to plug into AWS Lambda, perhaps for periodic scheduled checks.  It uses DATABASE_PATH and DRY_RUN environment variables for easy configuration.  Also, the database layer has been abstracted to make it easier to reuse the processing logic.  

### Tech Stack
I chose to use Javascript because of familiarity of the language and the npm ecosystem.  I have a few years experience with Javascript, but first time using SQLite, although I use SQL Server at work, so it's not that far off.