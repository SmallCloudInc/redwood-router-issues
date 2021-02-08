# README

This repo is to help reproduce some internal redwood & router related issues that we have noticed.

### Issues

- Firebase login in the public portal does not refresh components. Example - `PortalLoginSignpModal.js` Line 21 - 27. In the UI, go to the public portal (Click "public portal" from the sidebar), logout if you are already logged out. Login using the test credentials. A window refresh is needed here for user to be logged in.
- Token link visited from the admin panel "Public portal" link in the sidebar of the admin app. This will load the public portal in a new tab, and will cause the app to render twice, and a flash in between the loading indicators. See `useHashRedirect.js` for implementation. The hook is used in the `Routes.js` and the token params is direct to redirect to the `routes.customToken` to handle the firebase token via token. Custom auth provider is used at `firebase.custom.authClient.ts`
- When visiting the admin panel `http://app.uservitals.local:8910` - The login page is shown for atlast a second and flahes, before loading the dashboard. See `HomeSwitchPage.js` for current implementation.

### Setup

We use Yarn as our package manager. To get the dependencies installed, just do this in the root directory:

```terminal
yarn install
```

### Run migrations

Make sure you have updated your `.env` file with the DB and firebase credentials.

```terminal
yarn run prisma migrate dev --preview-feature --schema ./api/db/schema.prisma
```

### Fire it up

```terminal
yarn rw dev --fwd="--disable-host-check=true"
```

A `.env` file is required to be created with proper credentials for the app to work.

#### Demo Companies and Seed data

The `yarn rw db seed` command can be run to create some demo companies, with associated stories, insights, and contacts. The password for admins and contacts created `Pwd$123`.

### Setting up a host domain

We need to be able to setup host records on the windows host so we can test the subdomain feature.

Inside your WSL Unix Terminal, run `ifpconfig`. Find the inet address for the eth0 interface. The ip will be similar to 192.168.158.200

Open a Windows Powershell terminal using the windows host. Run `code C:\Windows\System32\drivers\etc\hosts` to open the hosts file.

Enter the following lines, replacing your IP address.

```
YOUR_IP zipenterprises.uservitals.portal
YOUR_IP cloudops.uservitals.portal
YOUR_IP app.uservitals.local
```

Save the file and exit. (You may get a warning but asking to save as admin, proceed and save as admin)

Run `ipconfig /flushdns` in the Powershell terminal to allow the new host entries to be picked up by the OS.

On windows, you should be able to access the admin app via `http://app.uservitals.local:8910/`
and the public portal via `http://feedback.uservitals.local:8910/`

After the following changes, to access via the URLs above, you will need to run the dev server with `yarn rw dev --fwd="--disable-host-check=true"`

#### Preview migrate commands

Run the new migrate command with `yarn run prisma migrate dev --preview-feature --schema ./api/db/schema.prisma`

More info on Prisma preview migrate - https://www.prisma.io/docs/concepts/components/prisma-migrate
