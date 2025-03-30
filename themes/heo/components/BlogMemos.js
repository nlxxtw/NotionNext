import React, { useEffect, useState } from 'react';
import { loadExternalResource } from '@/lib/utils';

const BlogMemos = () => {
    const [isResourcesLoaded, setResourcesLoaded] = useState(false);

    useEffect(() => {
        // 并行加载CSS文件
        Promise.all([
            loadExternalResource('/css/memos.css', 'css'),
            loadExternalResource('/css/highlight.github.min.css', 'css'),
            loadExternalResource('/js/lazyload.min.js', 'js'),
            loadExternalResource('/js/marked.min.js', 'js'),
            loadExternalResource('/js/view-image.min.js', 'js'),
            loadExternalResource('/js/highlight.min.js', 'js'),
            loadExternalResource('/js/moment.min.js', 'js'),
        ])
        .then(() => {
            // 保证moment.js加载完成后再加载moment.twitter.js
            return loadExternalResource('/js/moment.twitter.js', 'js');
        })
        .then(() => {
            setResourcesLoaded(true); // 设置资源加载完成的状态
        })
        .catch(console.error);
    }, []);

    useEffect(() => {
        if (isResourcesLoaded) {
            // 当所有资源加载完成后，加载 memos.js
            const script = document.createElement('script');
            script.src = '/js/memos.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                // 组件卸载时移除script
                document.body.removeChild(script);
            };
        }
    }, [isResourcesLoaded]); // 依赖于资源加载状态
    
    return (
        <section id="main" className="container">
            <h2>zdDown说说</h2>
            <div className="total">一共 <span id="total">0</span> 条随想 🎉</div>
            <blockquote id="tag-filter" className="filter">
                <div id="tags"></div>
            </blockquote>

            <div id="memos" className="memos">
                {/* Memos Container */}
            </div>
        </section>
    );
};

export default BlogMemos;
