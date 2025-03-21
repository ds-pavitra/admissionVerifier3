import axios from 'axios';

const instance = axios.create({ baseURL: 'https://admission.cubiclehr.com/api/v1' });

const formAdminRoot = '/admissionForm/#/app';


const apiBaseUrl = 'https://admission.cubiclehr.com/api/v1';

const StorageUrl = 'https://admission.cubiclehr.com/storage/app/';

const getTokenFromLocalStorage = () => {
    const cUserData = JSON.parse(localStorage.getItem('authUser'));
    return cUserData ? `${cUserData.token_type} ${cUserData.access_token}` : null;
};

const apiRequestAsync = async (method, url, data, headers = {}, tokenNull) => {
    try {
        let token;
        if (!tokenNull) {
            token = getTokenFromLocalStorage();
        }
        const axiosConfig = {
            method,
            url,
            data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `${token}` } : {}),
                ...headers,
            },
        };

        const response = await axios(axiosConfig);
        const responseData = response.data;

        // Ensure responseData is defined before attempting to modify it
        if (responseData) {
            responseData.status = response.status;
        }

        return responseData;
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }
};

function formatDate(dateString) {
    if (!dateString) {
        return 'Unknown Date'; // Handle null or undefined input
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return 'Invalid Date'; // Handle invalid date strings
    }

    const options = {
        month: 'short', // 'short' for abbreviated month name (e.g., Jul)
        day: 'numeric',  // Numeric day (e.g., 1)
        year: 'numeric', // Full year (e.g., 2024)
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}




function customformatDate(date, format, separator) {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
        throw new Error('Invalid date object');
    }

    // Extract date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear().toString();
    const yearShort = year.slice(-2); // Last two digits of the year

    // Define the replacement patterns
    const formatPatterns = {
        'dd': day,
        'mm': month,
        'yyyy': year,
        'yy': yearShort
    };

    // Replace placeholders with actual date values
    const formattedDate = Object.keys(formatPatterns).reduce((acc, pattern) => {
        return acc.replace(pattern, formatPatterns[pattern]);
    }, format);

    // Replace all remaining separators with the provided separator
    return formattedDate.replace(/[-/.,]/g, separator);
}

function customFormatTime(date, format, separator) {
    // Helper function to pad single-digit numbers with leading zeros
    const pad = (number) => number.toString().padStart(2, '0');

    // Extract time components
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Replace format tokens with actual time values
    const formattedTime = format
        .replace('hh', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);

    // Join the formatted time with the custom separator
    return formattedTime.split(':').join(separator);
}


export {
    formAdminRoot,
    apiRequestAsync,
    apiBaseUrl,
    StorageUrl,
    instance,
    formatDate,
    customformatDate,
    customFormatTime
}