import Modal from 'react-modal';
import { connect } from 'react-redux';
import { Magnifier } from 'react-image-magnifiers';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {product} from '../../../dummyData'
import OwlCarousel from '../owl-carousel';
// import DetailOne from '~/components/partials/product/details/detail-one';

import { actions as demoAction } from '../../../store/demo';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(51,51,51,0.6)',
        zIndex: '9000'
    }
};

Modal.setAppElement( 'body' );

function QuickViewModalTwo ( props ) {
    const { id } = props;
    if ( !id ) {
        return <div></div>
    }

    const [view, setView] = useState(product)
    const router = useRouter();
    const [ carouselRef, setCarouselRef ] = useState( null );
    const events = {
        onTranslate: function ( e ) {
            let items = document.querySelectorAll( '.quickView-content .product-gallery-item' );
            document.querySelector( '.quickView-content .product-gallery-item.active' ).classList.remove( 'active' );
            items[ e.item.index ].classList.add( 'active' );
        }
    }

    useEffect( () => {
        router.events.on( 'routeChangeStart', closeModal );
        carouselRef && carouselRef.current && carouselRef.current.goTo( 0 );

        return () => {
            router.events.off( 'routeChangeStart', closeModal );
        }
    }, [] )

    function closeModal () {
        if ( document.querySelector( ".ReactModal__Content" ) ) {
            document.querySelector( ".ReactModal__Content" ).classList.remove( "ReactModal__Content--after-open" );
        }

        if ( document.querySelector( ".ReactModal__Overlay" ) ) {
            document.querySelector( ".ReactModal__Overlay" ).style.opacity = '0';
        }

        setTimeout( () => {
            props.hideQuick();
        }, 250 );
    }

    function changeBgImage ( e, index ) {
        e.preventDefault();
        document.querySelector( '.quickView-content .product-gallery-item.active' ).classList.remove( 'active' );
        e.currentTarget.classList.add( 'active' );
        carouselRef.current.goTo( index );
    }

    return (
        <>
            <Modal
                isOpen={ props.modalShow }
                onRequestClose={ closeModal }
                className="container quickView-container quickView-two"
                overlayClassName="d-flex align-items-center justify-content-center"
                shouldReturnFocusAfterClose={ false }
                closeTimeoutMS={ 100 }
                contentLabel="QuickView"
                style={ customStyles }
                id="product-quickview"
            >
                <div className="modal-content">
                    <div className="quickView-content skeleton-body">
                        <div className={ `row skel-pro-single skel-quickview mb-0 ${!product.length ? '' : 'loaded'}` }>
                            <div className="col-lg-6 p-0 d-flex flex-lg-row flex-column">
                                <div className="skel-product-gallery"></div>

                                {
                                    product.length ?
                                        <>
                                            <div className="product-sm col-lg-2 row p-0 order-lg-first order-last px-2 p-lg-0 m-lg-0 position-relative" id="owl-dots">
                                                        <a href="#" className={ `product-gallery-item h-auto p-lg-0 mb-0 mb-lg-1 active` }  onClick={ e => changeBgImage( e, index ) }>
                                                            <figure className="mb-0">
                                                                <LazyLoadImage
                                                                    alt="Thumbnail"
                                                                    src={product.image}
                                                                    width="100%"
                                                                    height={ 100 }
                                                                    className="d-block"
                                                                />
                                                            </figure>
                                                        </a>
                                            </div>

                                            <div className="product-lg mb-1 mb-lg-0 col-lg-10 pl-lg-3 pl-0 pr-0 pr-lg-3 order-lg-last order-first">
                                                {/* <OwlCarousel adClass="product-gallery-carousel owl-full owl-nav-dark cols-1 cols-md-2 cols-lg-3" onChangeRef={ setCarouselRef } events={ events } options={ { 'dots': false, 'nav': false } }>
                                                    { product.pictures.map( ( item, index ) =>
                                                        <Magnifier
                                                            imageSrc={ process.env.NEXT_PUBLIC_ASSET_URI + item.url }
                                                            imageAlt="product"
                                                            largeImageSrc={ process.env.NEXT_PUBLIC_ASSET_URI + item.url } // Optional
                                                            dragToMove={ false }
                                                            mouseActivation="hover"
                                                            cursorStyleActive="crosshair"
                                                            className="product-gallery-image"
                                                            style={ { paddingTop: `${product.pictures[ 0 ].height / product.pictures[ 0 ].width * 100}%` } }
                                                            key={ "gallery-" + index }
                                                        />
                                                    ) }
                                                </OwlCarousel> */}
                                            </div>
                                        </>
                                        : ""
                                }
                            </div>
                            <div className="col-lg-6 quickview-desc pl-lg-4 pr-0 mt-3 mt-lg-0">
                                <div className="entry-summary row">
                                    <div className="col-md-12">
                                        <div className="entry-summary1 mt-2 mt-md-0"></div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="entry-summary2"></div>
                                    </div>
                                </div>

                                <div className="product-summary pr-4">
                                    {
                                        product.length ?
                                            // <DetailOne product={ product } />
                                            ""
                                            : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button title="Close (Esc)" type="button" className="mfp-close" onClick={ closeModal }><span>×</span></button>
            </Modal>
        </>
    )
}

const mapStateToProps = ( state ) => {
    return {
        id: state.demo.single,
        modalShow: state.demo.quickShow,
    }
}

export default ( connect( mapStateToProps, { ...demoAction } )( QuickViewModalTwo ) );