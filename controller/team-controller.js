const Team = require("../model/team.model");
const Match = require("../model/match.model");

exports.createTeam = async (req, res) => {
    // Validate request
    console.log(req.body);
    if (!req.body)
        return res.status(400).send({
            message: "Team can not be empty"
        });

    // Create a Team 
    const team = new Team({
        team_name: req.body.team_name
    });

    // Save Team in the database
    try {
        const result = await team.save();
        res.send(result);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Team."
        });
    }
}

exports.getTeams = async (req, res) => {
    //  console.log(req);
    try {
        const pageNo = +req.query.pageNo || 1;
        const pageSize = +req.query.pageSize || 10;
        const team_name = req.query.name || null;
        const score = req.query.score || null;
        console.log(score)
        let searchBy = {}
        if (team_name)
            searchBy = { team_name: team_name };
        else if (score)
            searchBy = { score: +score };
        console.log(searchBy)
        const result = await Team.find(searchBy)
            .sort({ score: -1 })
            .skip((pageNo - 1) * pageSize).limit(pageSize)
            .select({ team_name: 1, wins: 1, losses: 1, ties: 1, score: 1, matches: 1 });
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send({

            message: err.message || "Some error occurred while retriving the Team details."
        });
    }
}
// exports.getTeamById = async (req, res) => {
//     //  console.log(req);
//     try {
//         const teamId = req.parms.id;
//         const result = await Match.find(

//         )
//             .sort({ score: -1 })
//             .skip((pageNo - 1) * pageSize).limit(pageSize)
//             .select({ team_name: 1, wins: 1, losses: 1, ties: 1, score: 1 });
//         res.send(result);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({

//             message: err.message || "Some error occurred while retriving the Team details."
//         });
//     }
// }
exports.pairTeam = async (req, res) => {
    // Validate request
    console.log(req.body);
    if (!req.body)
        return res.status(400).send({
            message: "Teams can not be empty"
        });
    const team1 = req.body.team1;
    const team2 = req.body.team2;
    const matchName = req.body.matchName;

    if (team1.result == "win" && team2.result == "win")
        return res.status(400).send({
            message: "Invalid request"
        });
    if (team1.result == "loss" && team2.result == "loss")
        return res.status(400).send({
            message: "Invalid request"
        });
    if ((team1.result == "tie" && team2.result != "tie") || (team1.result != "tie" && team2.result == "tie"))
        return res.status(400).send({
            message: "Invalid request"
        });
    // update Team1 in the database
    try {
        let winner = null;
        let loser = null;
        let tie = false;
        if (team1.result == 'win') {
            winner = team1.id;
            loser = team2.id;
        }
        else if (team2.result == 'win') {
            winner = team2.id;
            loser = team1.id;
        }
        else if (team1.result == 'tie')
            tie = true;

        const match = new Match({
            match_name: matchName,
            teams: [team1.id, team2.id],
            winner: winner,
            loser: loser,
            tie: tie
        });

        const result = await match.save();

        let team = await Team.findById(team1.id);
        team.wins = team1.result == 'win' ? team.wins + 1 : team.wins;
        team.losses = team1.result == 'loss' ? team.losses + 1 : team.losses;
        team.ties = team1.result == 'tie' ? team.ties + 1 : team.ties;
        team.score = team.score + getScores(team1.result);
        team.matches = ++team.matches;
        console.log(team)
        const result1 = await team.save();

        team = await Team.findById(team2.id);
        team.wins = team2.result == 'win' ? team.wins + 1 : team.wins;
        team.losses = team2.result == 'loss' ? team.losses + 1 : team.losses;
        team.ties = team2.result == 'tie' ? team.ties + 1 : team.ties;
        team.score = team.score + getScores(team2.result);
        team.matches = ++team.matches;
        const result2 = await team.save();

        res.send([result1, result2]);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while paring the Team."
        });
    }
}

const getScores = (result) => {
    if (result == 'win')
        return 3;
    else if (result == 'tie')
        return 1;
    else
        return 0;
}