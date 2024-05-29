// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'

// Styled component for the triangle shaped background image
// const TriangleImg = styled('img')({
//   right: 0,
//   bottom: 0,
//   height: 170,
//   position: 'absolute'
// })

// // Styled component for the trophy image
// const TrophyImg = styled('img')({
//   right: 36,
//   bottom: 20,
//   height: 98,
//   position: 'absolute'
// })

const Trophy = ({info, sentence}) => {
  // ** Hook
  //const theme = useTheme()
  //const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }} style={{background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.3)"}}>
      <CardContent>
        <Typography variant='h6'>{sentence}</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          {info}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Trophy
