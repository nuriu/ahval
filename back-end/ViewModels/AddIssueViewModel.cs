using System;

namespace Ajanda.ViewModels
{
    public class AddIssueViewModel
    {
        public string ComponentName { get; set; }
        public string RepoIdentifier { get; set; }
        public int IssueNumber { get; set; }
        public string Date { get; set; }
        public int RowNumber { get; set; }
    }
}