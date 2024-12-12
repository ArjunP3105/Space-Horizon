# **Space Horizon** 

Welcome to Space Horizon, a web application for space enthusiasts. This project was developed as a final project for Harvard's CS50 Web Programming with Python and JavaScript course. 

By **ArjunP3105**

# **What is Space Horizon?**

Space Horizon is a web application that helps you stay connected with the universe by tracking upcoming space events, delivering the latest space news, and enabling you to create a personalized watchlist and event calendar.

The app combines data from multiple APIs with user-driven functionality to provide a complete astronomy experience. Its features include:

- **Upcoming Events**: Track astronomical events and add them to your watchlist.
- **Space News**: Get the latest news and updates from the space industry.
- **Interactive Features**: View countdown timers, event maps, comment section, personalized event calendar.
- **Personalized Watchlist**: Watchlist events and access them through an integrated calendar.
- **Dynamic Notifications**: Receive instant alerts when your watch listed events begin.
- **User Profiles**: Create accounts, manage bookmarks, and interact with the app.

Video Link - https://youtu.be/Tv2kkT7lkAQ

# Reason behind Space Horizon

In our busy lives, we often miss out on the magnificent astronomical events that the universe has to offer. Whether it's a meteor shower, a solar eclipse, or a planetary alignment, these inspiring moments can pass by unnoticed.

**Space Horizon** aims to bridge this gap by providing an easy and efficient way to stay up-to-date with space events. Through this web application, users can discover upcoming astronomical events, add them to their watchlist, and receive timely notifications when these events occur. **Space Horizon** ensures that you never miss out on the incredible phenomena happening above.

---

# How to run

Clone the repository to your device :

```bash
git clone https://github.com/ArjunP3105/space.git
cd space
```

Create a virtual environment:

```bash
python3 -m venv venv
venv\Scripts\activate
```

Install the requirements :

```bash
pip install -r requirements.txt
```

Create new migrations :

```bash
python3 manage.py makemigrations space
```

Migrate :

```bash
python3 manage.py migrate
```

Run the server :

```bash
python3 manage.py runserver
```

Open your browser and go to http://127.0.0.1:8000/ to see the application in action.

---

# Explore the Features

The navigation bar provides easy access to Home, Username, and Log in/Log out and register options.

**Login / Register** :

![image](https://github.com/user-attachments/assets/a45681e4-9e64-42ca-9ca3-a8c3c707e3d5)

![image (1)](https://github.com/user-attachments/assets/2441dc5a-28c7-4f11-a232-d1ba43649031)


**Home Page:**

- Users are presented with 2 initial options :
1. Event
2. News

![home](https://github.com/user-attachments/assets/8b5783b0-adfa-4b80-b563-6d1066b80c08)


### **Event**:

- **Browse Events**: View a list of upcoming astronomical events.
- **View Details**: Get detailed information about each event, including descriptions, dates, images, additional information and location details.
- **Comment:** Ability to post comments on each event.
- **Watchlist**: Add events to your watchlist to keep track of them, and get notified when they occur.
- **Filter Events** : Filter events based on date ranges.
- **Interactive Map**: View an interactive map showing the best viewing locations for space events using [Leaflet.js](https://leafletjs.com/).

![outer event](https://github.com/user-attachments/assets/dde13449-bb60-4c3f-9311-a695cb8f8e84)

![inner event 2](https://github.com/user-attachments/assets/1da8af5b-15dd-40ed-8b3d-9a7947ca3dc0)

![image (2)](https://github.com/user-attachments/assets/7703c6d2-eaaf-49b6-a095-33fe90c05a4b)


### **News**:

- **Stay Updated**: Access the latest space news and articles using [NewsAPI](https://newsapi.org/).
- **Bookmark News**: Save interesting articles to your profile for later viewing.
- **External Links**: Clicking on a news articles “Read More “ takes you to the full article on the source website.

![news outer](https://github.com/user-attachments/assets/a21fe829-90f6-4ded-91a9-1d69208f72e2)

![news inner](https://github.com/user-attachments/assets/007a8311-4791-4a7c-a211-446af035300c)


### Pagination:

- **Efficient Navigation**: Pagination is implemented in both the **Event** and **News** sections to enhance user experience by displaying content in manageable chunks.
- **Load More Easily**: Instead of overwhelming the user with an extensive list, this feature allows seamless browsing through events and articles, ensuring faster load times and a cleaner interface.

### **Notifications**:

- **Alert System** : Receive notifications when an event on your watchlist has begun.The user is made aware of notifications by a number on the username on the navigation bar where the number represents the number of notifications.
- **Check Notification**  : Function that checks for notification every 5 minutes.
- **Clear Notification** : Clear all the user notification and removes the event from the calendar and watchlist.

![image (3)](https://github.com/user-attachments/assets/46bfc4cb-8645-46ce-ad60-7197d0cbef16)


### **User Profile**:

- **Custom Calendar**: See events you’ve added to your watchlist on a calendar view using [Full Calendar.](https://fullcalendar.io/)
- **Bookmarks**: Access your saved space news articles.
- **Notifications Tab**: View a list of your notifications and clear them when they are no longer needed.

![image (4)](https://github.com/user-attachments/assets/c0579a22-634d-4b7a-b9a3-ecce037d9f24)


![image (5)](https://github.com/user-attachments/assets/23a02558-4e3b-4801-aeee-a658b3e6fdf3)


**Mobile Responsiveness:**

- This web application is also mobile responsive providing an adaptive view for screens and devices of different sizes.

![image (6)](https://github.com/user-attachments/assets/205d7a6a-6111-4579-a2ad-ec6d0f035443)

![image (7)](https://github.com/user-attachments/assets/ff85a692-3dd5-4bc6-8520-e29a274a5af0)


---

# File Structure

Space Horizon is a web application built using Django for the backend and HTML, CSS, and JavaScript for the front end. Below is an outline of the project's structure and key components:

## **SPACE📁**

### **Backend:**

**admin.py**: This file is used to register Django models, enabling them to be accessed and managed through the Django admin interface.

**apps.py**: This file is used to configure the application within the Django project. It defines the application’s name and allows for additional app specific settings.

**models.py**: This file contains all the models that are used to store the information on the websites.

- **User:** A custom user model using abstract user, with an additional field for storing a user profile image.
- **Events:** Represents astronomical events with details like title, image, description, date, location, and coordinates.
- **Comments:** Allows users to add comments to specific events, including the comment text, associated user, and event.
- **Add_event:** Represents events that has been added to the watchlist by an user, enabling users to save custom events to their calendars with a title and start date and event id.
- **Add_news:** Stores bookmarked news articles, including data such as the author, description, publication date, and image URL from the NewsAPI.
- **Notification:** Tracks notifications for users about events, providing users with notification when the event begins.

urls.py: Contains URL patterns that map to different views in the application. These paths in urls are used to retrieve and post data from and to the Django views using fetch in JavaScript.

**views.py**: Views contain the main logic behind the web applications. Its written in python and contains of various functions that handles different aspects of web functionality. Each function is responsible for processing requests from users, interacting with the database, and returning the appropriate responses.

The key functions in views.py are:

**Index, Login, and Registration**:

- `index`: Renders the home page using index.html in static.
- `login_view`: Handles user login, authenticating the user and redirecting to the index page.
- `logout_view`: Logs out the user and redirects to the index page.
- `register`: Registers a new user and logs the user in.

 **Events**:

- `events`: Fetches space events from the database Events model and paginates the results.
- `inner_event`: Returns detailed information for a specific event from the Django model using event id.
- `add_comments`: Allows users to add comments to events.

**User Interaction with Events**:

- `event_comment`: Returns all comments for a specific event from the Comments Django model.
- `add_event`: Allows users to add or remove events from their personalized event watch list.
- `get_event`: Returns a list of events that the user has added , which allows us to display these events.
- `is_exist`: Checks if a specific event exists in the user's event list.
- `user_info`: Returns information about the current logged-in user.

**News and Notifications**:

- `news`: Fetches space-related news articles using the [NewsAPI](https://newsapi.org/) with parameters specified for space and paginates the results.
- `top_news`: Fetches top headlines from the [NewsAPI](https://newsapi.org/) and paginates them.
- `add_news`: Allows users to add or remove news articles from their bookmarks.
- `news_exist`: Checks if a specific news article is already bookmarked by the current user.
- `bookmark_news`: Returns a list of news articles bookmarked by the user to be displayed in the user profile.
- `add_noti`: Adds an event to the user's notifications list when a watch listed event begins.
- `notification`: Returns the details on the notification to be showed to the user.
- `clear_noti`: Clears all notifications for the user and removes those events from the watchlist and calendar that have already happened.

**Event Filtering and Search**:

- `filter_event`:Filters the events present in Django models using date ranges.

---

### Frontend:

static/space: static was used to store files such as HTML ,CSS, JavaScript and image files that are used in the web application. These files are essential for styling and adding functionality to your web application.

- /style.css: Contains the styling for all the elements present in the web application. This is responsible for defining the visual appearance of the web application. The elements have also been modified to be mobile responsive.
- /script.js: Contains java script code for dynamic functioning of the index page and the events page. This file is crucial for creating a responsive, interactive, and user-friendly web application. The script.js is responsible for handling multiple apis and functions from the Django views for the purpose of the functionality of the web applications.
    
    Script.js contains the following functions for:
    
    **Events**: 
    
    - Contains functions for loading events and the individual events with their information's , comments, interactive maps using [Leaflet](https://leafletjs.com/) api.
    - Handles the addition of events into the full calendar via the watchlist button.
    - Handles pagination of events for better management and user experience.
    - Sort the events by retrieving dates from the user.
    
    **Calendar**: 
    
    - Contains functions to initialize and load the calendar.
    - Watch listed events are added to the personalized user calendar using [Full Calendar API](https://fullcalendar.io/).
    
    **User Page**: 
    
    - Contains functions to load the user page of the current user.
    - Loads the calendar with the specific events of the user and the bookmarked news.
    - Contains the Notification center for the user notification.
    
    **Countdown**: 
    
    - Function for showing timer countdown for all events.
    - Adds the event to notification model if the timer ends and the event has been watch listed.
    
    **Notification**:
    
    - Notification function to add event notification when the watch listed event has begun.
    - Function that checks for notifications every 5 minutes.
    - Clear Function to clear the notification from the center and remove the watch listed events that have occurred from the calendar.
    
- /news.js : Similar to the script.js but this is mostly concentrated on the functionality, responsiveness , interactivity of the news option of the web applications.
    
    news.js contains the following functions :
    
    **News** :
    
    - Function to retrieve the top and latest news from the news function in the news Django views using fetch.
    - Loads the list of news articles available along with pagination for better user experience and performance.
    - Loads the inner news that contains of images , information , author details and buttons to bookmark and read more of the article.
    
    **Bookmark** :
    
    - Function to add/remove a specific news article from a django bookmark model by clicking the bookmark button.
    - Loads the news articles bookmarked by the user into the ‘Bookmarked’ option in the user profile page
    
    **Notification**:
    
    - Function to load the notification for the specific user into the notification center of the user profile page using fetch from the views function.
    
    **/images/** : 
    
    - A folder in the static directory that contains all the images used throughout the web application, including icons, backgrounds, and other visual assets.
    

**/templates/space :** : Contains all the HTML templates used for rendering the web application's frontend, including pages for events, news, user profiles, and other sections.

**Index.html** :

- This is the main HTML file used for this web application.
- It contains many div elements with different classes.
- These various div enables seamless page transitions and content updates via JavaScript without requiring a full page refresh.

**Layout.html** :

- This HTML page contains the constant layout that appears across other HTML pages
- The content from other  pages like index.html are dynamically loaded onto the {% block body %} within <body> tag of the Layout.html
- Other pages extend this layout using {% extends "space/layout.html" %} to inherit the common structure
- This contains of the elements that make up the common navigation bar seen thought the web application.

**Login.html** :

- This HTML page is for users who already have an account on Space Horizon.
- It allows users to input their username and password.
- Upon submission, the input data is sent to Django’s login view, where the user’s credentials are authenticated using Django's built-in authentication system.
- If authentication is successful, the user is logged in.

```python
from django.contrib.auth import authenticate,login,logout
user = authenticate(request, username=username, password=password)
login(request, user)
```

**Register.html** :

- New users who do not have accounts on Space Horizon are redirected to the register.html page.
- This page allows users to create new accounts by providing information such as their username, email, and password.
- Upon form submission, the data is sent to the Django view, where the user account is created. After successful registration, the user is automatically logged in.
- Once logged in, users gain access to additional features such as watchlists, notifications, bookmarks, and posting comments, which are not available to non-logged-in users.
- This is done just like the login in page using  Django's built-in authentication system.

```python
from django.contrib.auth import authenticate,login,logout
 user = User.objects.create_user(username, email, password)
 user.save()
 login(request, user)
```

### **Other files :**

**manage.py :**

- manage.py is the command-line utility for interacting with your Django project.
- It serves as the entry point for tasks such as running the development server, creating database migrations, and creating app specific tasks.

**db.sqlite3** :

- db.sqlite3 is the default SQLite database file used by Django for storing the project’s data.
- It's a lightweight, server less database that's automatically created.

# Acknowledgements :

Apis used :

- [NewsAPI](https://newsapi.org/docs)
- [Full Calendar API](https://fullcalendar.io/docs)
- [Leaflet API](https://leafletjs.com/reference.html)

Images :

- Icons and Logo : [Canva](https://www.canva.com) , [Google](http://www.google.com)
- Event Images :  [Google](https://google.com/)

Event Information : [Google](http://www.google.com)

# Let's Connect! :

LinkedIn - [Arjun P](https://www.linkedin.com/in/arjun-p-810a96318/) 

GitHub - [ArjunP3105](https://github.com/ArjunP3105)
