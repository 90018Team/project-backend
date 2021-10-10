##Structure
    *   index.ts: Root of the functions
    *   user.ts: an example of CURD action for the database (see comments inside for usage)
    *   emergency.ts and other .ts files: more functions can be implemented, please remember to reference your logic to the index.ts file.

##Before push
    *   Remember most of the CURD action can be done by Firestore auth apis
    *   It is not so good to get handle user tokens manually (though nobody stop you from doing that)
        *   Also, tokens has referesh rate of 3600 seconds.