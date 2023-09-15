import { Button } from "@mui/joy"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import CardContent from "@mui/joy/CardContent"
import CardCover from "@mui/joy/CardCover"
import Typography from "@mui/joy/Typography"

export const CardCity = () => {

return( 
<Box
    component="ul"
    sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 0, m: 0 }}
  >
    <Card sx={{ minWidth: 300, flexGrow: 1, minHeight: 400 }}>
      <CardCover>
        <img
          src='/src/Images/PublicImages/lviv4.jpg'
          srcSet="/src/Images/PublicImages/lviv5.jpg"
          loading="lazy"
          alt=""
        />
      </CardCover>
      <CardContent>
        <Typography
          level="body-lg"
          fontWeight="lg"
          fontSize={60}
          sx={{fontWeight: 'bold', textDecoration: 'outline'}}
          textAlign={'center'}
          textColor="#fff"
          mt={{ xs: 12, sm: 10 }}
        >
          Welcome to Lviv!
        </Typography>
        <Typography
          level="body-lg"
          fontWeight="lg"
          fontSize={32}
          sx={{ textDecoration: 'outline', pr: 10}}
          textAlign={'center'}
          textColor="#fff"
          mt={{ xs: 12, sm: -2}}
        >
          Where do you want to go?
        </Typography>
        <Box textAlign='center' sx={{pr: 24, mt:2}}>
        <Button 
        color="success"
        size="lg"
        sx={{ 
          color: '#fff', 
          fontSize: 18, 
          textTransform: 'none'
          }}>

          Find your comfortable way!
        </Button>
        </Box>
      </CardContent>
    </Card>
    </Box>
    );
};