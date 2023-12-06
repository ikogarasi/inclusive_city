using Incity.Services.AuthAPI.Dto;
using Microsoft.VisualBasic.FileIO;

namespace Incity.Services.AuthAPI.Helpers
{
    public class CsvUserReader
    {
        private const int FieldsCount = 4;
        private readonly string _filePath;
        private readonly string _delimiter;

        public CsvUserReader(string filePath, string delimiter = ",")
        {
           _filePath = filePath;
            _delimiter = delimiter;
        }

        public List<CsvUserDto> Read()
        {
            var dataList = new List<CsvUserDto>();

            using var parser = new TextFieldParser(_filePath);

            parser.SetDelimiters(_delimiter);
            parser.HasFieldsEnclosedInQuotes = true;

            var skipHeader = true;

            while (!parser.EndOfData)
            {
                var fields = parser.ReadFields();

                if (skipHeader)
                {
                    skipHeader = false;
                    continue;
                }

                var data = ParseData(fields);
                dataList.Add(data);
            }

            return dataList;
        }

        private CsvUserDto ParseData(string[] fields)
        {
            if (fields.Length < FieldsCount)
            {
                throw new ArgumentException("Invalid number of fields for User.");
            }

            var user = new CsvUserDto
            (
                fields[0],
                fields[1],
                fields[2],
                fields[3].Split(_delimiter)
            );

            return user;
        }
    }
}
