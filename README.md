<h2> <img src="https://user-images.githubusercontent.com/102346844/207746783-6e8125c3-6839-4aab-b9b7-5c10e7c3e63e.png" alt="logo" width="20"/> My Travel Pins</h2>
  

A community-featured travel journal website with weather forecasts and currency converters widgets.    
Users can own a map, log memories and interact with friends.

<a href="https://my-travel-pins.web.app/" target="_blank"><strong>WebURL</strong></a>  

> Test account: demo@test.com  
> Password: mikamika

## Skills
![react](https://img.shields.io/badge/React-18.2.0-blue)
![leaflet](https://img.shields.io/badge/leaflet-1.9.2-blue)
![react-leaflet](https://img.shields.io/badge/react--leaflet-4.1.0-blue)
![react-google-maps/api](https://img.shields.io/badge/react--google--maps%2Fapi-2.13.1-blue)
![firestore](https://img.shields.io/badge/-Firebase%20Firestore-yellow)
![storage](https://img.shields.io/badge/-Firebase%20Storage-yellow)
![storage](https://img.shields.io/badge/-Algolia-blue)
![TypeScript](https://img.shields.io/badge/-TypeScript-blue)

- Built website by **Create React App** with **TypeScript**.
- Used **Leaflet** to create GeoJSON world maps and markers.
- Enabled users to log memory with text and photos on a specific place by **geographical searches**.
- Integrated **Google Street View** and **Google Map** services into a memory to make it more appealing to users.  
- Enabled users to interact by being friends, visiting each other's maps, and leaving messages on a specific memory.
- Used [Firebase Firestore](https://firebase.google.com/products/firestore?gclid=CjwKCAiAheacBhB8EiwAItVO28-dEN0HxmIJg1aGbiA3z4z2XdbI_t_J8RuB_W-qyDRDdDIGTE0svRoCzlIQAvD_BwE&gclsrc=aw.ds) to manage users' and memories' data and get **real-time updates** on memories, friend status, and messages.
- Enabled **full-text search** on multiple fields by integrating Firebase Firestore data with [Algolia](https://www.algolia.com/).
- Stored files of avatars and **photos uploaded** by users in Firebase Storage.
- **Compressed** each image file under 0.5MB to **save storage space** and **optimize the loading time** by browser-image-compression.
- Connected a third-party API [(OpenWeather)](https://openweathermap.org/api) to fetch **real-time forecast data** and integrated Google Map services into the weather widget.
- Wrote a **Node.js** script to fetch **real-time exchange rate data** [(RTER)](https://tw.rter.info/howto_currencyapi.php) and stored it in Firebase Firestore. 
- Made the widget robot **rotating** and **draggable** by using React Spring and [@use-gesture/react](https://www.npmjs.com/package/@use-gesture/react).
- Made widgets **draggable** and **resizable** by using [React-Grid-Layout](https://www.npmjs.com/package/react-grid-layout).
- Added a moving finger on the landing page by using [@react-leaflet-tracking-marker](https://www.npmjs.com/package/react-leaflet-tracking-marker) to assist users in easily finding out the instruction of the website.

## Functional Map
![functional map_my travel pins](https://user-images.githubusercontent.com/102346844/208008614-6b920d3c-b4d3-451c-bfcd-03ffe87befb6.png)

## Main Features

### Landing page
Users can sign up / sign in, use widgets, and read the instruction of the website.
![image](https://user-images.githubusercontent.com/102346844/207783015-f2042f37-a2eb-47cc-a9f6-93df848d211d.png)

### My Map page
A member can add new pin on his/her map, log memories, and check a specific memory content.
![image](https://user-images.githubusercontent.com/102346844/207782091-97cd21a9-1b26-41ca-97fd-e611793d64c3.png)

### Memories page
- My Memories   
Members can review and delete his/her memories.  
- Friend's Memories   
Only member and member's friends have access to review memories.

![image](https://user-images.githubusercontent.com/102346844/207786751-fd3d8a16-5dd9-49fe-8e6e-2319c1f25797.png)


### My friends page 
- Search a user ( full-text-search on fields of name and email ) and check your friend status.  
- Send friend requests, manage friend requests, and visit a friend. 
![image](https://user-images.githubusercontent.com/102346844/207785728-5cfdede7-518b-4e37-8176-9efe4392802a.png)
![image](https://user-images.githubusercontent.com/102346844/207783922-21c88216-26c1-43fc-a654-79318bbbd2c1.png)

### Widgets - use them anytime and anywhere
- Weather Forecast
![image](https://user-images.githubusercontent.com/102346844/207788888-fd48b3b9-3740-4428-b1e2-a1f9d6b0f159.png)
- Currency Converter ( provides 24 currencies )
![image](https://user-images.githubusercontent.com/102346844/207789479-49b976f2-ac03-4510-b02e-f223b8539b6f.png)

### Instruction for users
![image](https://user-images.githubusercontent.com/102346844/207789631-e988bb58-a8ae-4965-9c22-2afcdcb43087.png)
