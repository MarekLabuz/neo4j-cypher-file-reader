# Simple script for running a list of neo4j cypher queries

**Usage:** npm start -- [filename] [username] [password]

Script reads the provided file and executes queries via HTTP POST on a locally running Neo4j server.

Provided file should contain one query per one line. Script supports inline comments (e.g._// this is comment_) and ignores empty lines.

_Developed and tested on Node version 7.9.0_
