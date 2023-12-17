import { Avatar, Typography } from "@mui/joy";
import { Box } from "@mui/material";
import { useGetAllQuestionsForUserQuery } from "../../../api/quesionsRtkApi";

export const UserQuestion = () => {
  const { data = [] } = useGetAllQuestionsForUserQuery(false);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 3,
          marginTop: 3,
        }}
      >
        <Typography level="h2">The latest your questions:</Typography>
        {data.map((value) => (
          <Box sx={{ marginLeft: 2, marginTop: 3, marginBottom: 4 }}>
            <Typography
              startDecorator={
                <Avatar component="span" size="lg" variant="outlined" />
              }
              sx={{ "--Typography-gap": "12px" }}
            >
              <b>{value.question.userName}</b>, {value.question.email}
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              <i>{new Date(value.question.timeStamp).toDateString()}</i>,{" "}
              {value.question.isClosed ? (
                <b style={{ color: "green" }}>Answered</b>
              ) : (
                <b style={{ color: "red" }}>Waiting for answer</b>
              )}
            </Typography>
            <Typography
              textColor="text.secondary"
              sx={{ marginTop: 2, marginRight: 5 }}
            >
              {value.question.description}
            </Typography>
            {value.answer && (
              <>
                <Typography sx={{ marginLeft: 3, marginTop: 2 }} level="h4">
                  Response:
                </Typography>
                <Box
                  sx={{
                    marginLeft: 5,
                    marginTop: 3,
                    marginBottom: 4,
                    backgroundColor: "lightgrey",
                    border: 1,
                    borderBlockColor: "lightgrey",
                    borderRadius: 2,
                    width: "70%",
                    paddingLeft: 3,
                  }}
                >
                  <Typography
                    startDecorator={
                      <Avatar component="span" size="lg" variant="outlined" />
                    }
                    sx={{ "--Typography-gap": "12px" }}
                  >
                    <b>{value.answer.userName}</b>
                  </Typography>
                  <Typography sx={{ marginTop: 2 }}>
                    <i>{new Date(value.answer.timeStamp).toDateString()}</i>
                  </Typography>
                  <Typography
                    textColor="text.secondary"
                    sx={{ marginTop: 2, marginRight: 5 }}
                  >
                    {value.answer.text}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        ))}
      </Box>
    </div>
  );
};
