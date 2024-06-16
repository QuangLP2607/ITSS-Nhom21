import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';


const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.keyCode === 37) { // Phím trái
                if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                }
            } else if (event.keyCode === 39) { // Phím phải
                if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentPage, totalPages, handlePageChange]);

    const renderPagination = () => {
        const pages = [];
        const visiblePages = 3; // Số lượng trang hiển thị trực tiếp
        const ellipsisThreshold = 5; // Ngưỡng để hiển thị dấu "..."
        const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        const endPage = Math.min(totalPages, startPage + visiblePages - 1);

        // Hiển thị nút trang đầu tiên
        if (startPage > 1) {
            pages.push(
                <Button key={1} variant={currentPage === 1 ? "danger" : "dark"} onClick={() => handlePageChange(1)}>{1}</Button>
            );
            // Hiển thị dấu "..." nếu cần
            if (startPage > ellipsisThreshold) {
                pages.push(<span key="ellipsis1" style={{ margin: '0 5px' }}><div style={{fontWeight: 'bold'}}>...</div></span>);
            }
        }

        // Hiển thị các nút trang từ startPage đến endPage
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button key={i} variant={currentPage === i ? "danger" : "dark"} onClick={() => handlePageChange(i)} style={{ margin: '0 5px' }}>{i}</Button>
            );
        }

        // Hiển thị nút trang cuối cùng
        if (endPage < totalPages) {
            // Hiển thị dấu "..." nếu cần
            if (totalPages - endPage > ellipsisThreshold - 1) {
                pages.push(<span key="ellipsis2" style={{margin: '0 5px'}}><div style={{fontWeight: 'bold'}}>...</div></span>);
            }
            pages.push(
                <Button key={totalPages} variant={currentPage === totalPages ? "danger" : "dark"} onClick={() => handlePageChange(totalPages)} style={{ margin: '0 5px' }}>{totalPages}</Button>
            );
        }

        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                {pages}
            </div>
        );
    };

    return renderPagination();
};

export default Pagination;
