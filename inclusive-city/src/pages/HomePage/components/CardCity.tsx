import { Button } from "@mui/joy"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import CardContent from "@mui/joy/CardContent"
import CardCover from "@mui/joy/CardCover"
import Typography from "@mui/joy/Typography"
import { useNavigate } from "react-router-dom"

export const CardCity = () => {
  const navigate = useNavigate();
return( 
<Box
    component="ul"
    sx={{ flexWrap: 'wrap', p: 0, m: 0 }}
    
  >
    <Card sx={{ minWidth: 300, flexGrow: 1, minHeight: 500 }}>
      <CardCover>
        <img
          src='/src/Images/PublicImages/lviv4.jpg'
          srcSet="/src/Images/PublicImages/lviv5.jpg"
          loading="lazy"
          alt=""
        />
      </CardCover>
      <CardContent>
      <Box textAlign='center'marginTop={3} marginBottom={4} >
        <Typography
          level="body-lg"
          fontWeight="lg"
          fontSize={60}
          sx={{fontWeight: 'bold', textDecoration: 'outline', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',}}
          textAlign={'center'}
          textColor="#fff"
          mt={{ xs: 12, sm: 10 }}
        >
          Вітаємо у Львові!
        </Typography>
        <Typography
          level="body-lg"
          fontWeight="lg"
          fontSize={32}
          sx={{ textDecoration: 'outline', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',}}
          textAlign={{xs: 'start', sm: 'center'}}
          textColor="#fff"
          marginTop={2}
          
        >
          Куди б ви хотіли завітати сьогодні?
        </Typography>
        <Button 
        color="success"
        size="lg"
        onClick={() => { navigate('/map')}}
        sx={{ 
          color: '#fff', 
          fontSize: 22, 
          textTransform: 'none',
          marginTop: 4,
          }}
          >

          Знайди свій комфортний шлях!
        </Button>
        </Box>
      </CardContent>
    </Card>
    </Box>
    );
};