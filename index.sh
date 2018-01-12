# Installing Node, Git and NPM packages
echo "Installing dependencies...";
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -;
sudo apt-get install nodejs;
sudo apt-get install git;
npm install;
echo "...Dependencies installed.";

# Start our application!
npm start