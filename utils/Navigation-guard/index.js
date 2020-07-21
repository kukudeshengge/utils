import { getToken } from '@/utils/token.js';
import React from 'react';


/**
 * 导航守卫
 */
export default Com => {
    return props => {
        let token = getToken();
        if (!token) {
            props.history.push('/login');
            return null;
        } else {
            return <Com {...props} />
        }
    }
}