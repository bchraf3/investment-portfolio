using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvestmentPortfolio.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnusedPreferencesFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultPortfolioView",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "PortfolioSummaryNotificationsEnabled",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "ShowPerformanceInPercentage",
                table: "UserPreferences");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultPortfolioView",
                table: "UserPreferences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "PortfolioSummaryNotificationsEnabled",
                table: "UserPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowPerformanceInPercentage",
                table: "UserPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
