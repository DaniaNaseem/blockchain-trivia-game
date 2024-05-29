// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Grid from '@mui/material/Grid'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Trophy from '@/components/Trophy'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';




//import {format} from 'date-fns'

import IconButton from '@mui/material/IconButton'

import { useState, useEffect } from 'react'

import CardHeader from '@mui/material/CardHeader'

//import DotsVertical from 'mdi-material-ui/DotsVertical'


const statusObj = {
  paused: { color: 'info' },
  discarded: { color: 'error' },
  //current: { color: 'primary' },
  pending: { color: 'warning' },
  completed: { color: 'success' }
}

const DashboardTable = () => {

    const [scores, setScores] = useState([]);
    
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTM3NzIyZTlkOGI5YjA0MmM1YzBhZTQiLCJ1c2VybmFtZSI6Im15TmFtaVdhbGxldCIsIndhbGxldF9hZGRyZXNzIjoiYWRkcjFxeHI5dms2bXJ2dmFwN2NtN2trIiwic3Rha2Vfa2V5Ijoic3Rha2UxdXg1emQ1YTBwaHNqNW0iLCJpc0Jhbm5lZCI6ZmFsc2UsInN0YXR1cyI6IjAgYW5kIEluYWN0aXZlIiwiX192IjowLCJpZCI6IjY1Mzc3MjJlOWQ4YjliMDQyYzVjMGFlNCIsInNlY3JldEtleSI6ImF2YWNhZG9zIiwiaWF0IjoxNzAwNzQyOTI5LCJleHAiOjE3MDA4MjkzMjl9.XOvPNP2RdJ7peyNrGUMdbuV82zxJ4Mvc5nGPzAJ0lI8"

    const [bounty, setBounty] = useState(null)

    const [seasonDetails, setSeasonDetails] = useState(null);


    useEffect(()=>{
        (async () => {
            try {
              //const token = process.env.NEXT_PUBLIC_TOKEN;
              
              const response = await fetch('http://3.134.237.219:3000/api/seasons/activeSeasonDetails', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
             
              if (response.ok) {
                const data = await response.json();
                setSeasonDetails(data);
                //console.log("successfully fetched leaderboard data");
                //console.log(data);
              } else {
                console.error('Failed to fetch data');
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          })();
    }, [])

        


    useEffect(()=>{
        (async () => {
            try {
              //const token = process.env.NEXT_PUBLIC_TOKEN;
              
              const response = await fetch('http://3.134.237.219:3000/api/bounty', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
             
              if (response.ok) {
                const data = await response.json();
                setBounty(data);
                //console.log("successfully fetched leaderboard data");
                //console.log(data);
              } else {
                console.error('Failed to fetch data');
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          })();
    }, [])


  async function getLeaderboard(seasonNumber){
    try {
      //const token = process.env.NEXT_PUBLIC_TOKEN;
      
      const response = await fetch(`http://3.134.237.219:3000/api/seasons/seasonDetails/${seasonNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      //const text = await response.text()
      //console.log(text);

      if (response.ok) {
        const data = await response.json();

        setSeasonDetails(data);
        setScores(data.seasonScores);

      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function convertToInt(variable) {
    // Check if the variable is a string
    if (typeof variable === 'string') {
      // Try to parse the string to an integer
      const parsedInt = parseInt(variable, 10);
  
      // Check if parsing was successful
      if (!isNaN(parsedInt)) {
        // Return the parsed integer
        return parsedInt;
      } else {
        // Handle the case where parsing failed (e.g., the string was not a valid number)
        console.error(`Failed to parse "${variable}" to an integer`);
        return null; // or you can choose to throw an error, return a default value, etc.
      }
    }
  
    // If the variable is not a string, return it as is
    return variable;
  }



  useEffect(() => {
    (async () => {
        try {
          //const token = process.env.NEXT_PUBLIC_TOKEN;
          
          const response = await fetch('http://3.134.237.219:3000/api/scores/sortedByScoreAndTime', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
         
          if (response.ok) {
            const data = await response.json();
            setScores(data);
            //console.log("successfully fetched leaderboard data");
            //console.log(data);
          } else {
            console.error('Failed to fetch data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      })();
  }, [token]);

  async function loadPreviousLeaderboard(){
    //if season is 1, then don't do anything

    if(!seasonDetails){
      return
    }

    if(seasonDetails && seasonDetails.seasonNumber == 1){
      return;
    }
    else if(seasonDetails && seasonDetails.seasonNumber == '1'){
      return
    }
    else{
      const seasonNumberInt = convertToInt(seasonDetails.seasonNumber);
      await getLeaderboard(seasonNumberInt-1);
    }
    //else make api call for:
    //get leaderboard(seasonNumber) and update render variables
  }

  async function loadNextLeaderboard(){
    if(!seasonDetails){
      return
    }
    else{
      const seasonNumberInt = convertToInt(seasonDetails.seasonNumber);
      await getLeaderboard(seasonNumberInt + 1);
    }
    //get leaderboard(seasonNumber) and update render variables
    //if nothing returned, don't re-render anything.
  }

  return (
    <>
    
      
    <section id="header">
    


    <Grid container spacing={0}>
        <Grid item xs={0} md={4} lg={4}>
        <img src='/images/ItsFun.png' style={{minWidth:"33vw", maxWidth:"33vw"}}/>
        </Grid>
        <Grid item xs={0} md={4} lg={4}>
        <img src='/images/Play2Earn.png' style={{minWidth:"33vw", maxWidth:"33vw"}}/>
        </Grid>
        <Grid item xs={0} md={4} lg={4}>
        <img src='/images/ReadyToPlay.png' style={{minWidth:"33vw", maxWidth:"33vw"}}/>
        </Grid>
    </Grid>
    
    

    </section>
      <Grid container spacing={1} style={{padding: "10px", paddingTop:"25px"}}>
          <Grid item xs={1} md={1} container alignItems="center" justify="center">
          <button onClick={loadPreviousLeaderboard}><ArrowBackIosIcon/></button>
          </Grid>
          
          <Grid item xs={5} md={5}>
          <Trophy info={seasonDetails ? (seasonDetails.seasonNumber) : (0)} sentence={"Season:"}/>
          </Grid>
          <Grid item xs={5} md={5}>
          <Trophy info={bounty? (bounty) : (0)} sentence={"Bounty Collected for Current Season (Lovelace):"}/>
          </Grid>
          <Grid item xs={1} md={1} container alignItems="center" justify="center">
          <button onClick={loadNextLeaderboard}><ArrowForwardIosIcon/></button>
          </Grid>
        </Grid>
    
    

   
    <Card>
      <CardHeader
        title=''
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            {/* <DotsVertical /> */}
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              
            </Box>{' '}
            
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />  
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Stake Key</TableCell>
              <TableCell>Wallet Address</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {(scores) ? scores.map((score, index) => (
              <TableRow hover key={score._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{index+1} </Typography>
                    <Typography variant='caption'>{score.designation}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{score.username.slice(0, 15)}...</TableCell>
                <TableCell>{score.stake_key.slice(0,15)}...</TableCell>
                <TableCell>{score.wallet_address.slice(0,15)}</TableCell>
                <TableCell>{score.score}</TableCell>
                {/* <TableCell>
                  <Chip
                    label={transaction.status}
                    color={statusObj[transaction.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell> */}
              </TableRow>
            )):(
              <tr>
                <td colSpan="5" className="px-4 py-4 text-sm text-gray-500 light:text-gray-300">
                  Loading transactions...
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
    
    
    
    </>
  )
}

export default DashboardTable
