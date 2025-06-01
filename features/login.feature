Feature: Login

  Scenario: Valid user logs in successfully
    Given I open the login page
    When I enter "testuser" into the username field
    And I enter "password123" into the password field
    And I click the login button
    Then I should see the dashboard with message "Welcome back, TestUser!"