const botbuilder = require('botbuilder');
const restify = require('restify');
const service = require('./service.js');
const request = require('request');
//create a bot
const connector = new botbuilder.ChatConnector({
    appId: "bb8316ed-559f-4e00-addf-2ac8d251f03f",
    appPassword: "wvg9cc89RZWhNLOBwhyJi3R"
});
const bot = new botbuilder.UniversalBot(
    connector, [
        (session) => {
            session.beginDialog('ensureProfile', session.userData.profile);
        }, (session, result) => {
            const userDetails = session.userData.profile = result.response;



            service.createIncident(userDetails.shortDesc, userDetails.detailedDesc, function (incidentNo) {
                if (incidentNo) {
                    session.endConversation(`Hi User, here is a ticket created with number ${incidentNo}`);
                } else {
                    session.endConversation(`Hi User There is an error`);
                }

            });


        }

    ]
);

bot.dialog('ensureProfile', [
    (session, args, next) => {
        session.dialogData.profileDetails = {} || args;
        if (!session.dialogData.profileDetails.typeOfTicket) {
            botbuilder.Prompts.text(session, "Is it a incident or a service request");
        } else {
            next();
        }
    },
    (session, result, next) => {
        if (result.response) {
            session.dialogData.profileDetails.typeOfTicket = result.response;
        }
        if (!session.dialogData.profileDetails.selfOrOthers) {
            botbuilder.Prompts.text(session, "is it for yourself or others?");
        } else {
            next();
        }
    }, (session, result, next) => {
        if (result.response) {
            session.dialogData.profileDetails.selfOrOthers = result.response;
        }
        if (!session.dialogData.profileDetails.shortDesc) {
            botbuilder.Prompts.text(session, "please give a small descrition");
        } else {
            next();
        }
    }, (session, result, next) => {
        if (result.response) {
            session.dialogData.profileDetails.shortDesc = result.response;
        }
        if (!session.dialogData.profileDetails.detailedDesc) {
            botbuilder.Prompts.text(session, "please give me a detailed description");
        } else {
            next();
        }
    }, (session, result) => {
        if (result.response) {
            session.dialogData.profileDetails.detailedDesc = result.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profileDetails });
    }
])


//set up RestAPIs
const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(
    process.env.PORT || 3978, () => console.log('Server is running')
);
